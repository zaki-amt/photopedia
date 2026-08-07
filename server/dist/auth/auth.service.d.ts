import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: {
        name: string;
        username: string;
        email: string;
        password: string;
        avatar?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            name: string;
            avatar: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            name: string;
            avatar: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
}
