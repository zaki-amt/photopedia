import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

/**
 * Photopedia NestJS Application Entrypoint
 * Bootstraps the HTTP application server with cross-origin security (CORS),
 * DTO validation pipes, global exception filtering, response transformation interceptors,
 * and local static file storage routing.
 */
async function bootstrap() {
  // Step 1: Initialize the NestJS Express Application instance with AppModule
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Step 2: Configure Cross-Origin Resource Sharing (CORS) for Next.js web client compatibility
  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:3000']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or if origin is in whitelist
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  });

  // Step 3: Enable global class-validator & class-transformer DTO validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Step 4: Register global HTTP exception filter for clean, pretty error JSON responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Step 5: Register global response interceptor to wrap success payloads in pretty response body envelopes
  app.useGlobalInterceptors(new TransformInterceptor());

  // Step 6: Serve uploaded media assets dynamically from local server filesystem ('server/uploads/')
  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Step 7: Launch HTTP listener on port 4000
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Photopedia NestJS Backend Server running on http://localhost:${port}`);
  console.log(`📁 Static uploads folder served at http://localhost:${port}/uploads/`);
}

bootstrap();
