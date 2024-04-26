import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TelegramService } from 'nestjs-telegram';
import {
  TelegramMessage,
  TelegramSendMessageParams,
} from 'nestjs-telegram/dist/interfaces/telegramTypes.interface';
@Processor('send-message-telegram')
export class TelegramConsumer {
  constructor(private readonly telegramService: TelegramService) {}
  private readonly logger = new Logger(TelegramConsumer.name);

  @Process('send-stats-report')
  async sendMessageToRoom(job: Job<any>): Promise<TelegramMessage> {
    return this.telegramService.sendMessage(job.data).toPromise();
  }

  @Process('send-log')
  async sendLog(job: Job<TelegramSendMessageParams>): Promise<TelegramMessage> {
    return this.telegramService.sendMessage(job.data).toPromise();
  }
}
