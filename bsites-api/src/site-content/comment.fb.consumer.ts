import {OnQueueCompleted, OnQueueFailed, Process, Processor,} from '@nestjs/bull';
import {Job} from 'bull';
import {Injectable, Logger} from '@nestjs/common';
import {COMMENT_SEND_TO_POST_QUEUE, POSTS_SEND_TO_FB_QUEUE} from './constants';
import {SiteContentService} from "./site-content.service";
import {TelegramBotService} from "../telegram/telegram.service";
import {HttpService} from "@nestjs/axios";
import {FbPageService} from "../fb-page/fb-page.service";
import {ContentStatus} from "./enum/content-status-enum";
import {FbPage} from "../fb-page/entities/fb-page.entity";
import * as fs from "fs";
import FormData from "form-data"
import {SiteContent} from "./entities/site-content.entity";

@Processor({
  name: COMMENT_SEND_TO_POST_QUEUE.INSERT_COMMENT_QUEUE,
})
@Injectable()
export class CommentFbConsumer {
  private readonly logger = new Logger(CommentFbConsumer.name);
  constructor(
      private readonly pageService: FbPageService,
      private readonly httpService: HttpService,
      private readonly telegramService: TelegramBotService
  ) {}

  @OnQueueCompleted()
  async onComplete(job: Job<any>, result: any) {
    this.logger.log(
      `Job complete with page id ${job.data.payload.page_id}`,
    );
  }

  @OnQueueFailed()
  async onFailed(job: Job<any>, error) {
    this.logger.error(`Job failed with page id ${job.data.payload.page_id}`);
    this.logger.error(error.message  || error.toString())
  }

  @Process({
    name: COMMENT_SEND_TO_POST_QUEUE.SEND_COMMENT_TO_POST,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async sendCommentToPost(job: Job<any>) {
    const { payload: data } = job.data
    const page = await this.pageService.findOne(data.page_id)

    const url = `https://graph.facebook.com/${data.post_id}/comments?access_token=${page.access_token}&message=${data.comment}`

    try {
      await this.httpService.post(url, null, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).toPromise()

      await this.telegramService.sendLogToTelegram(`Send COMMENT: ${data.comment} success to post ${data.post_id} on page: ${page.page_name}`)

    } catch (e) {
      const msg = e.response?.data?.error?.message ?? e.toString()

      await this.telegramService.sendLogToTelegram(`Cannot send COMMENT to post ${data.post_id} in page: ${page.page_name} with comment: ${data.comment}, Error: ${msg}`)

      throw new Error(`Cannot send comment to post ${data.post_id} in page ${page.page_name}, Error: ${msg}`);
    }
  }
}
