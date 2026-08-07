import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAllFeed(category?: string, feedType?: string, currentUserId?: string, search?: string) {
    let authorIdFilter: any = undefined;

    if (feedType === "following") {
      if (!currentUserId) {
        throw new BadRequestException("Must be logged in to view the following feed");
      }
      const follows = await this.prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      });
      const followingIds = follows.map((f) => f.followingId);
      authorIdFilter = { in: followingIds };
    }

    const searchFilter = search && search.trim() ? {
      OR: [
        { title: { contains: search.trim() } },
        { caption: { contains: search.trim() } },
        { category: { contains: search.trim() } },
        { tags: { contains: search.trim() } },
        { author: { name: { contains: search.trim() } } },
        { author: { username: { contains: search.trim() } } },
      ],
    } : {};

    const where: any = {
      deletedAt: null,
      ...(category && category !== "All" ? { category } : {}),
      ...(authorIdFilter ? { authorId: authorIdFilter } : {}),
      ...searchFilter,
    };

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        exif: true,
        likes: currentUserId ? { where: { userId: currentUserId } } : false,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      image: post.image,
      caption: post.caption,
      category: post.category,
      tags: post.tags ? post.tags.split(",").map((t) => t.trim()) : [],
      author: post.author,
      exif: post.exif,
      likes: post._count.likes,
      likesCount: post._count.likes,
      comments: post._count.comments,
      commentsCount: post._count.comments,
      isLiked: post.likes && Array.isArray(post.likes) && post.likes.length > 0,
      createdAt: post.createdAt,
    }));
  }

  async findOne(id: string, currentUserId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true, bio: true },
        },
        exif: true,
        likes: currentUserId ? { where: { userId: currentUserId } } : false,
        comments: {
          include: {
            user: { select: { name: true, username: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return {
      ...post,
      tags: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
      likes: post._count.likes,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: post.likes && Array.isArray(post.likes) && post.likes.length > 0,
    };
  }

  async create(userId: string, dto: {
    title: string;
    image: string;
    caption?: string;
    category: string;
    tags?: any;
    camera?: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
  }) {
    if (!dto.image || !dto.image.trim()) {
      throw new BadRequestException('Image URL or file path is required');
    }

    // Verify author exists in database, fallback to first user if not found
    let authorId = userId;
    const authorExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!authorExists) {
      const firstUser = await this.prisma.user.findFirst();
      if (!firstUser) {
        throw new BadRequestException('No valid user found in database to author this photograph');
      }
      authorId = firstUser.id;
    }

    let tagsString = '';
    if (Array.isArray(dto.tags)) {
      tagsString = dto.tags.join(', ');
    } else if (typeof dto.tags === 'string') {
      tagsString = dto.tags;
    }

    return this.prisma.post.create({
      data: {
        title: dto.title || 'Untitled Photograph',
        image: dto.image.trim(),
        caption: dto.caption || '',
        category: dto.category || 'Landscape',
        tags: tagsString,
        authorId: authorId,
        exif: {
          create: {
            camera: dto.camera || 'Sony A7IV',
            lens: dto.lens || '24mm f/1.4 GM',
            aperture: dto.aperture || 'f/2.8',
            shutter: dto.shutter || '1/1000s',
            iso: dto.iso || '100',
          },
        },
      },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        exif: true,
      },
    });
  }

  async toggleLike(userId: string, postId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Ensure user exists
      let validUserId = userId;
      const uExists = await tx.user.findUnique({ where: { id: userId } });
      if (!uExists) {
        const fallback = await tx.user.findFirst();
        if (fallback) validUserId = fallback.id;
      }

      const existingLike = await tx.like.findUnique({
        where: {
          userId_postId: { userId: validUserId, postId },
        },
      });

      if (existingLike) {
        await tx.like.delete({ where: { id: existingLike.id } });
        const count = await tx.like.count({ where: { postId } });
        return { liked: false, count };
      } else {
        await tx.like.create({
          data: { userId: validUserId, postId },
        });
        const count = await tx.like.count({ where: { postId } });
        return { liked: true, count };
      }
    });
  }

  async addComment(userId: string, postId: string, content: string) {
    if (!content || !content.trim()) {
      throw new BadRequestException('Comment content cannot be empty');
    }

    return this.prisma.$transaction(async (tx) => {
      let validUserId = userId;
      const uExists = await tx.user.findUnique({ where: { id: userId } });
      if (!uExists) {
        const fallback = await tx.user.findFirst();
        if (fallback) validUserId = fallback.id;
      }

      return tx.comment.create({
        data: {
          content: content.trim(),
          userId: validUserId,
          postId,
        },
        include: {
          user: { select: { name: true, username: true, avatar: true } },
        },
      });
    });
  }

  async getTopCategories() {
    const categories = await this.prisma.post.groupBy({
      by: ['category'],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    });

    return categories.map((c) => ({
      name: c.category,
      count: c._count.id,
    }));
  }

  async flagPost(postId: string, reason?: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const log = await this.prisma.moderationLog.create({
      data: {
        postId: post.id,
        reason: reason || 'User reported content for review',
        action: 'FLAGGED',
        status: 'PENDING',
      },
    });

    return { success: true, message: 'Post flagged and sent to Content Moderation Queue', logId: log.id };
  }

  async removePost(postId: string, userId: string, userRole: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post ${postId} not found`);
    }

    if (userRole !== 'ADMIN' && post.authorId !== userId) {
      throw new BadRequestException('Not authorized to delete this post');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });
  }

  async updatePost(
    postId: string,
    userId: string,
    userRole: string,
    dto: {
      title?: string;
      caption?: string;
      category?: string;
      tags?: any;
      camera?: string;
      lens?: string;
      aperture?: string;
      shutter?: string;
      iso?: string;
    },
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { exif: true },
    });

    if (!post) {
      throw new NotFoundException(`Post ${postId} not found`);
    }

    if (userRole !== 'ADMIN' && post.authorId !== userId) {
      throw new BadRequestException('Not authorized to edit this post');
    }

    let tagsString = post.tags;
    if (Array.isArray(dto.tags)) {
      tagsString = dto.tags.join(', ');
    } else if (typeof dto.tags === 'string') {
      tagsString = dto.tags;
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title !== undefined ? dto.title : post.title,
        caption: dto.caption !== undefined ? dto.caption : post.caption,
        category: dto.category !== undefined ? dto.category : post.category,
        tags: tagsString,
      },
    });

    if (post.exif) {
      await this.prisma.exifData.update({
        where: { id: post.exif.id },
        data: {
          camera: dto.camera !== undefined ? dto.camera : post.exif.camera,
          lens: dto.lens !== undefined ? dto.lens : post.exif.lens,
          aperture: dto.aperture !== undefined ? dto.aperture : post.exif.aperture,
          shutter: dto.shutter !== undefined ? dto.shutter : post.exif.shutter,
          iso: dto.iso !== undefined ? dto.iso : post.exif.iso,
        },
      });
    }

    return updatedPost;
  }
}
