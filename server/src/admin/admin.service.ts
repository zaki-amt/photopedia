import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverviewMetrics() {
    const totalUsers = await this.prisma.user.count({ where: { deletedAt: null } });
    const publishedPhotos = await this.prisma.post.count({ where: { deletedAt: null } });
    const totalLikes = await this.prisma.like.count();
    const totalComments = await this.prisma.comment.count({ where: { deletedAt: null } });
    const flaggedQueue = await this.prisma.moderationLog.count({
      where: { status: 'PENDING' },
    });

    const recentLogs = await this.prisma.moderationLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        post: { select: { title: true, image: true, author: { select: { username: true } } } },
      },
    });

    return {
      totalUsers,
      publishedPhotos,
      totalEngagement: totalLikes + totalComments,
      flaggedQueue,
      recentActivity: recentLogs,
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        status: true,
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

  async toggleUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const newStatus = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
      select: { id: true, status: true, username: true },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), status: 'DELETED' },
      select: { id: true, username: true },
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

    if (status === 'REMOVED' && log.postId) {
      await this.prisma.post.update({
        where: { id: log.postId },
        data: { deletedAt: new Date() },
      });
    }

    return log;
  }
}
