import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('send-mail')
export class MailConsumer {
  constructor(private readonly mailerService: MailerService) {}
  private readonly logger = new Logger(MailConsumer.name);

  @OnQueueFailed()
  async onFailed(job: Job<any>, error) {
    this.logger.error(
      `Job failed when send mail to ${job.data.user.email}. Error: ${error.message}`,
    );
  }

  @Process('send-file')
  async sendMailToUser(job: Job<any>) {
    try {
      await this.mailerService.sendMail({
        to: job.data.user.email,
        subject: 'Domain export file',
        template: './sendFile',
        context: {
          username: job.data.user.email,
        },
        attachments: [
          {
            filename: 'Domain.csv',
            content: Buffer.from(job.data.buffer).toString('base64'),
            encoding: 'base64',
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        ],
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
