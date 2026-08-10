import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Serve static uploaded files from process.cwd()/uploads directory
  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Photopedia NestJS Backend Server running on http://localhost:${port}`);
  console.log(`📁 Static uploads folder served at http://localhost:${port}/uploads/`);
}

bootstrap();
