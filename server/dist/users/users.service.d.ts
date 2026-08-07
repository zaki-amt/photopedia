import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUsername(username: string): Promise<{
        stats: {
            posts: number;
            followers: number;
            following: number;
        };
        posts: ({
            _count: {
                likes: number;
                comments: number;
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
        })[];
        _count: {
            posts: number;
            followers: number;
            following: number;
        };
        id: string;
        email: string;
        username: string;
        name: string;
        avatar: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: {
        name?: string;
        username?: string;
        email?: string;
        avatar?: string;
        bio?: string;
    }): Promise<{
        id: string;
        email: string;
        username: string;
        name: string;
        avatar: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleFollow(followerId: string, followingId: string): Promise<{
        following: boolean;
    }>;
    getSuggestedCreators(): Promise<{
        id: string;
        username: string;
        name: string;
        avatar: string;
        bio: string;
        _count: {
            posts: number;
            followers: number;
        };
    }[]>;
}
