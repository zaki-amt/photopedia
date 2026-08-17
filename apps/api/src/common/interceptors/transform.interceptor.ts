import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  path: string;
  timestamp: string;
}

/**
 * Step 1: Global Response Transform Interceptor
 * Intercepts all successful NestJS controller return payloads and wraps them in a
 * clean, pretty, enterprise-grade response body containing status code, success flag, data payload, path, and timestamp.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode || 200;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        success: true,
        message: 'Request successful',
        data: data !== undefined ? data : null,
        path: request.url,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
