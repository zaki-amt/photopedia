import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiStatus() {
    return {
      name: 'Photopedia NestJS API Server',
      status: 'online',
      version: '1.0.0',
      database: 'PostgreSQL (Prisma ORM)',
      endpoints: {
        auth: '/auth/register, /auth/login',
        posts: '/posts, /posts/top-categories, /posts/:id',
        users: '/users/:username, /users/suggested',
        admin: '/admin/metrics, /admin/users, /admin/moderation',
      },
      studioUrl: 'http://localhost:5555 (Prisma Studio Database GUI)',
    };
  }
}
