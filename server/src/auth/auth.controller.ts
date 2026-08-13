import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';

/**
 * Step 1: Auth Controller
 * Handles user account creation (registration) and authentication (login).
 * Maps incoming HTTP requests to AuthService business logic.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Step 2: User Registration Endpoint (POST /auth/register)
   * Validates user registration payload via RegisterDto and creates new user record.
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Step 3: User Authentication Endpoint (POST /auth/login)
   * Verifies email credentials & bcrypt password hash, issuing a JWT access token.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
