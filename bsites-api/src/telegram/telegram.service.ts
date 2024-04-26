import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
export class TelegramBotService {
  constructor(@InjectQueue('send-message-telegram') private queue: Queue) {}

  async sendStatsToTelegram(message: string) {
    const data = {
      chat_id: process.env.STATS_TELEGRAM_ROOM,
      text: `[${process.env.APP_NAME}] ${message}`,
      parse_mode: 'html',
    };
    await this.queue.add('send-stats-report', data);
  }

  async sendLogToTelegram(message: string) {
    const data = {
      chat_id: process.env.LOG_TELEGRAM_ROOM,
      text: `[${process.env.APP_NAME}] ${message}`,
      parse_mode: 'html',
    };
    await this.queue.add('send-log', data);
  }
}
