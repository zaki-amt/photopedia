import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
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

    const { password, ...result } = user;
    return {
      ...result,
      stats: {
        posts: user._count.posts,
        followers: user._count.followers,
        following: user._count.following,
      },
    };
  }

  async updateProfile(userId: string, dto: { name?: string; username?: string; email?: string; avatar?: string; bio?: string }) {
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: dto.username.toLowerCase(), NOT: { id: userId } },
      });
      if (existing) {
        throw new BadRequestException('Username is already taken');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        username: dto.username ? dto.username.toLowerCase() : undefined,
        email: dto.email ? dto.email.toLowerCase() : undefined,
        avatar: dto.avatar,
        bio: dto.bio,
      },
    });

    const { password, ...result } = updated;
    return result;
  }

  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existingFollow) {
      await this.prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return { following: false };
    } else {
      await this.prisma.follow.create({
        data: { followerId, followingId },
      });
      return { following: true };
    }
  }

  async getSuggestedCreators() {
    const creators = await this.prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        _count: {
          select: { followers: true, posts: true },
        },
      },
      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
    });

    return creators;
  }
}
