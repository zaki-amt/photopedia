import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

/**
 * Step 1: AuthService
 * Encapsulates security operations, password hashing (bcrypt), user registration,
 * credential validation, and JWT payload signing.
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Step 2: Register New User Account
   * 1. Checks if email or username already exists in database
   * 2. Hashes plain-text password using 10 bcrypt salt rounds
   * 3. Creates new user account in SQLite database
   * 4. Issues signed JWT access token containing user sub/email
   */
  async register(dto: RegisterDto) {
    // Step 2a: Check email uniqueness
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      throw new BadRequestException('Email address is already registered');
    }

    // Step 2b: Check username uniqueness
    const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existingUsername) {
      throw new BadRequestException('Username is already taken');
    }

    // Step 2c: Hash plain password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Step 2d: Insert user record into database
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username.toLowerCase(),
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        avatar: dto.avatar || '/avatar.jpg',
        role: 'user',
      },
    });

    // Step 2e: Sign JWT token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    const { password, ...result } = user;
    return {
      user: result,
      accessToken: token,
    };
  }

  /**
   * Step 3: Login User Account
   * 1. Finds user account by email address
   * 2. Compares plain password against stored bcrypt hash
   * 3. Enforces moderation account status check (prevents blocked users from logging in)
   * 4. Signs and returns fresh JWT access token
   */
  async login(dto: LoginDto) {
    // Step 3a: Lookup user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Step 3b: Compare bcrypt password hash
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Step 3c: Check if account is blocked by moderator
    if (user.status?.toLowerCase() === 'blocked') {
      throw new UnauthorizedException('Your account has been blocked by an administrator. Please contact support.');
    }

    // Step 3d: Issue JWT token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    const { password, ...result } = user;
    return {
      user: result,
      accessToken: token,
    };
  }
}
