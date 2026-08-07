"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async toggleUserRole(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
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
    async updateModerationStatus(logId, status) {
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map