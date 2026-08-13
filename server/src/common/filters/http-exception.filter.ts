import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Step 1: Global HTTP Exception Filter
 * Intercepts all unhandled exceptions thrown across NestJS controllers/services
 * and formats them into a clean, standardized error response structure with status code and timestamp.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Step 2: Determine HTTP status code from Exception or fallback to 500
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Step 3: Extract human-readable error message payload
    let message: string | string[] = 'An unexpected server error occurred';
    let errorName = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      errorName = exception.name || 'HttpException';
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = res.message || res.error || message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Step 4: Return standardized pretty JSON error body
    response.status(status).json({
      statusCode: status,
      success: false,
      error: errorName,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
