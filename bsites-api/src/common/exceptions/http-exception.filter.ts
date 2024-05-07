import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TelegramBotService } from '../../telegram/telegram.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}
  // private readonly telegramService: TelegramBotService
  private readonly logger = new Logger('Bsite API', { timestamp: true });
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const res = exception.getResponse() as Object

    if (status >= 500) {
      this.logger.error(message);
      // this.telegramService.sendLogToTelegram(message)
    }

    response.status(status).json({
      // statusCode: status,
      // message,
      ...res,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
