import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    private checkAdmin;
    getMetrics(req: any): Promise<{
        totalUsers: number;
        publishedPhotos: number;
        totalEngagement: number;
        flaggedQueue: number;
    }>;
    getUsers(req: any): Promise<{
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
    toggleRole(req: any, userId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getModeration(req: any): Promise<({
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
    updateModeration(req: any, logId: string, status: 'APPROVED' | 'REMOVED'): Promise<{
        id: string;
        createdAt: Date;
        postId: string;
        reason: string;
        status: import(".prisma/client").$Enums.ModerationStatus;
    }>;
}
