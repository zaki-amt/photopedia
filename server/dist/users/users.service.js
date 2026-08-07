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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUsername(username) {
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
            throw new common_1.NotFoundException(`User @${username} not found`);
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
    async updateProfile(userId, dto) {
        if (dto.username) {
            const existing = await this.prisma.user.findFirst({
                where: { username: dto.username.toLowerCase(), NOT: { id: userId } },
            });
            if (existing) {
                throw new common_1.BadRequestException('Username is already taken');
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
    async toggleFollow(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.BadRequestException('Cannot follow yourself');
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
        }
        else {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map