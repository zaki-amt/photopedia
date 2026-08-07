import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverviewMetrics(): Promise<{
        totalUsers: number;
        publishedPhotos: number;
        totalEngagement: number;
        flaggedQueue: number;
    }>;
    getAllUsers(): Promise<{
        postsCount: number;
        id: string;
        email: string;
        username: string;
        name: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        _count: {
            posts: number;
        };
    }[]>;
    toggleUserRole(userId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getModerationQueue(): Promise<({
        post: {
            author: {
                username: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            title: string;
            image: string;
            caption: string | null;
            category: string;
            tags: string[];
            authorId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        postId: string;
        reason: string;
        status: import(".prisma/client").$Enums.ModerationStatus;
    })[]>;
    updateModerationStatus(logId: string, status: 'APPROVED' | 'REMOVED'): Promise<{
        id: string;
        createdAt: Date;
        postId: string;
        reason: string;
        status: import(".prisma/client").$Enums.ModerationStatus;
    }>;
}
