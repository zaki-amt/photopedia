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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllFeed(category) {
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
            tags: post.tags,
            author: post.author,
            exif: post.exif,
            likes: post._count.likes,
            comments: post._count.comments,
            createdAt: post.createdAt,
        }));
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        return {
            ...post,
            likesCount: post._count.likes,
        };
    }
    async create(userId, dto) {
        return this.prisma.post.create({
            data: {
                title: dto.title,
                image: dto.image,
                caption: dto.caption,
                category: dto.category,
                tags: dto.tags || [],
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
    async toggleLike(userId, postId) {
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
        }
        else {
            await this.prisma.like.create({
                data: { userId, postId },
            });
            return { liked: true };
        }
    }
    async addComment(userId, postId, content) {
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
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map