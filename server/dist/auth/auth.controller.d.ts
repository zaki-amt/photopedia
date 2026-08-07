import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
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
    login(body: {
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
