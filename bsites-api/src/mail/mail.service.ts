import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('send-mail') private mailQueue: Queue) {}
  async sendFileToUser(user: Partial<User>, buffer: any) {
    await this.mailQueue.add('send-file', { user, buffer });
  }
}
