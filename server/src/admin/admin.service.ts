import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverviewMetrics() {
    const totalUsers = await this.prisma.user.count();
    const publishedPhotos = await this.prisma.post.count();
    const totalLikes = await this.prisma.like.count();
    const totalComments = await this.prisma.comment.count();
    const flaggedQueue = await this.prisma.moderationLog.count({
      where: { status: 'PENDING' },
    });

    return {
      totalUsers,
      publishedPhotos,
      totalEngagement: totalLikes + totalComments,
      flaggedQueue,
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    return users.map((u) => ({
      ...u,
      postsCount: u._count.posts,
    }));
  }

  async toggleUserRole(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, role: true },
    });
  }

  async getModerationQueue() {
    return this.prisma.moderationLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            author: { select: { username: true, name: true } },
          },
        },
      },
    });
  }

  async updateModerationStatus(logId: string, status: 'APPROVED' | 'REMOVED') {
    const log = await this.prisma.moderationLog.update({
      where: { id: logId },
      data: { status },
    });

    if (status === 'REMOVED') {
      await this.prisma.post.delete({
        where: { id: log.postId },
      });
    }

    return log;
  }
}
