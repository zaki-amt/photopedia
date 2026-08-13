import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        coverImage: true,
        bio: true,
        location: true,
        website: true,
        cameraBody: true,
        backupCamera: true,
        lenses: true,
        accessories: true,
        role: true,
        createdAt: true,
        posts: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          include: {
            exif: true,
            _count: { select: { likes: true, comments: true } },
          },
        },
        _count: {
          select: { followers: true, following: true, posts: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User @${username} not found`);
    }

    return {
      ...user,
      stats: {
        posts: user._count.posts,
        followers: user._count.followers,
        following: user._count.following,
      },
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: dto.username.toLowerCase(),
          NOT: { id: userId },
        },
      });
      if (existing) {
        throw new BadRequestException('Username is already taken by another creator');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.username && { username: dto.username.toLowerCase() }),
        ...(dto.email && { email: dto.email.toLowerCase() }),
        ...(dto.avatar && { avatar: dto.avatar }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.cameraBody !== undefined && { cameraBody: dto.cameraBody }),
        ...(dto.backupCamera !== undefined && { backupCamera: dto.backupCamera }),
        ...(dto.lenses !== undefined && { lenses: dto.lenses }),
        ...(dto.accessories !== undefined && { accessories: dto.accessories }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        coverImage: true,
        bio: true,
        location: true,
        website: true,
        phone: true,
        cameraBody: true,
        backupCamera: true,
        lenses: true,
        accessories: true,
        role: true,
      },
    });
  }

  async followUser(followerId: string, targetIdentifier: string) {
    const targetUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: targetIdentifier },
          { username: targetIdentifier.toLowerCase() },
        ],
        deletedAt: null,
      },
    });

    if (!targetUser) {
      throw new NotFoundException(`Target creator @${targetIdentifier} not found`);
    }

    if (followerId === targetUser.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUser.id,
        },
      },
    });

    if (existingFollow) {
      await this.prisma.follow.delete({ where: { id: existingFollow.id } });
      return { following: false, targetUsername: targetUser.username, targetUserId: targetUser.id };
    } else {
      await this.prisma.follow.create({
        data: {
          followerId,
          followingId: targetUser.id,
        },
      });
      return { following: true, targetUsername: targetUser.username, targetUserId: targetUser.id };
    }
  }

  async unfollowUser(followerId: string, targetIdentifier: string) {
    const targetUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: targetIdentifier },
          { username: targetIdentifier.toLowerCase() },
        ],
      },
    });

    if (!targetUser) {
      throw new NotFoundException(`Target creator @${targetIdentifier} not found`);
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUser.id,
        },
      },
    });

    if (existingFollow) {
      await this.prisma.follow.delete({ where: { id: existingFollow.id } });
    }

    return { following: false, targetUsername: targetUser.username, targetUserId: targetUser.id };
  }

  async getFollowers(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        followers: {
          include: {
            follower: {
              select: { id: true, name: true, username: true, avatar: true, bio: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User @${username} not found`);
    }

    return user.followers.map((f) => f.follower);
  }

  async getFollowing(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        following: {
          include: {
            following: {
              select: { id: true, name: true, username: true, avatar: true, bio: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User @${username} not found`);
    }

    return user.following.map((f) => f.following);
  }

  async getFollowingIds(userId: string) {
    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return follows.map((f) => f.followingId);
  }

  async getSuggestedCreators(currentUserId?: string, limit?: number) {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
        role: "user",
        ...(currentUserId ? { NOT: { id: currentUserId } } : {}),
      },
      ...(limit ? { take: limit } : {}),
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        _count: { select: { followers: true, posts: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
