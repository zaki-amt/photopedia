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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingEmail) {
            throw new common_1.BadRequestException('Email address is already registered');
        }
        const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
        if (existingUsername) {
            throw new common_1.BadRequestException('Username is already taken');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                username: dto.username.toLowerCase(),
                email: dto.email.toLowerCase(),
                password: hashedPassword,
                avatar: dto.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                role: 'USER',
            },
        });
        const token = this.jwtService.sign({ sub: user.id, email: user.email });
        const { password, ...result } = user;
        return {
            user: result,
            accessToken: token,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const token = this.jwtService.sign({ sub: user.id, email: user.email });
        const { password, ...result } = user;
        return {
            user: result,
            accessToken: token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map