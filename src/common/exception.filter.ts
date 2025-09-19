import { Catch, ArgumentsHost, HttpException, HttpStatus, type LoggerService, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response: Response = context.getResponse();

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, request, response);
    } else {
      this.handleUnexpectedException(exception, request, response);
    }
  }

  private handleHttpException(exception: HttpException, request: Request, response: Response) {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
        ? (exceptionResponse as { message: string | string[] }).message
        : exception.message;

    response.status(statusCode).json({ statusCode, message, path: request.url });
  }

  private handleUnexpectedException(exception: unknown, request: Request, response: Response) {
    const timestamp = new Date().toISOString();
    const stack = exception instanceof Error ? exception.stack : undefined;

    let log = `Unexpected Exception: `;
    log += `${exception instanceof Error ? exception.message : JSON.stringify(exception)}`;

    this.logger.error(log, {
      path: request.url,
      method: request.method,
      stack,
      timestamp,
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      path: request.url,
    });
  }
}
