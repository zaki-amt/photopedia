import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: { name: string; username: string; email: string; password: string; avatar?: string }) {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      throw new BadRequestException('Email address is already registered');
    }

    const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existingUsername) {
      throw new BadRequestException('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username.toLowerCase(),
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        avatar: dto.avatar || '/avatar.jpg',
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

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'BLOCKED') {
      throw new UnauthorizedException('Your account has been blocked by an administrator. Please contact support.');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    const { password, ...result } = user;
    return {
      user: result,
      accessToken: token,
    };
  }
}
