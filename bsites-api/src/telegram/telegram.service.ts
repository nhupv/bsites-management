import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { User } from 'src/users/entities/user.entity';
export class TelegramBotService {
  constructor(@InjectQueue('send-message-telegram') private queue: Queue) {}

  async sendFilteredDomainRoom(message: string) {
    const data = {
      message,
    };
    await this.queue.add('send-filtered-room', data);
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
