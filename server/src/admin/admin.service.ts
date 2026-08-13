import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverviewMetrics() {
    const [
      totalUsers,
      publishedPhotos,
      totalLikes,
      totalComments,
      flaggedQueue,
      recentLogs,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.post.count({ where: { deletedAt: null } }),
      this.prisma.like.count(),
      this.prisma.comment.count({ where: { deletedAt: null } }),
      this.prisma.moderationLog.count({ where: { status: 'pending' } }),
      this.prisma.moderationLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          post: { select: { title: true, image: true, author: { select: { username: true } } } },
        },
      }),
    ]);

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

    const currentRoleLower = user.role?.toLowerCase();
    const newRole = currentRoleLower === 'admin' ? 'user' : 'admin';
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, role: true },
    });
  }

  async toggleUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const currentStatusLower = user.status?.toLowerCase();
    const newStatus = currentStatusLower === 'blocked' ? 'active' : 'blocked';
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
      data: { deletedAt: new Date(), status: 'deleted' },
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
