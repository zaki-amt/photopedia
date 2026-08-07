import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAllFeed(category?: string) {
    const where = category && category !== 'All' ? { category } : {};

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        exif: true,
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
      tags: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
      author: post.author,
      exif: post.exif,
      likes: post._count.likes,
      comments: post._count.comments,
      createdAt: post.createdAt,
    }));
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true, bio: true },
        },
        exif: true,
        comments: {
          include: {
            user: { select: { name: true, username: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return {
      ...post,
      tags: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
      likesCount: post._count.likes,
    };
  }

  async create(userId: string, dto: {
    title: string;
    image: string;
    caption?: string;
    category: string;
    tags?: string | string[];
    camera?: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
  }) {
    const tagsString = Array.isArray(dto.tags) ? dto.tags.join(', ') : dto.tags || '';

    return this.prisma.post.create({
      data: {
        title: dto.title,
        image: dto.image,
        caption: dto.caption,
        category: dto.category,
        tags: tagsString,
        authorId: userId,
        exif: {
          create: {
            camera: dto.camera,
            lens: dto.lens,
            aperture: dto.aperture,
            shutter: dto.shutter,
            iso: dto.iso,
          },
        },
      },
      include: {
        author: { select: { name: true, username: true, avatar: true } },
        exif: true,
      },
    });
  }

  async toggleLike(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: { userId, postId },
      });
      return { liked: true };
    }
  }

  async addComment(userId: string, postId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
      include: {
        user: { select: { name: true, username: true, avatar: true } },
      },
    });
  }

  async getTopCategories() {
    const categoryCounts = await this.prisma.post.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    return categoryCounts.map((c) => ({
      name: c.category,
      count: c._count.category,
    }));
  }
}
