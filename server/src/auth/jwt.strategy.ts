import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'photopedia_secure_jwt_secret_key_2026',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.deletedAt !== null) {
      throw new UnauthorizedException('Invalid user token');
    }

    const statusLower = user.status?.toLowerCase();
    if (statusLower === 'blocked' || statusLower === 'deleted') {
      throw new UnauthorizedException('Your account has been deactivated or blocked by an administrator.');
    }

    const { password, ...result } = user;
    return result;
  }
}
