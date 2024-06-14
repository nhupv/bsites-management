import {OnQueueCompleted, OnQueueFailed, Process, Processor,} from '@nestjs/bull';
import {Job} from 'bull';
import {Injectable, Logger} from '@nestjs/common';
import {POSTS_QUEUE} from './constants';
import {SiteContentService} from "./site-content.service";
// import { CreateDashboardDto } from "./dto/create-dashboard.dto";
import {TelegramBotService} from "../telegram/telegram.service";
import {HttpService} from "@nestjs/axios";
import {ContentStatus} from "./enum/content-status-enum";
import {UpdatePostStatusDto} from "./dto/update-post-status.dto";
import {Site} from "../sites/entities/site.entity";
import {SiteContent} from "./entities/site-content.entity";

@Processor({
  name: POSTS_QUEUE.INSERT_STATS_QUEUE,
})
@Injectable()
export class PostConsumer {
  private readonly logger = new Logger(PostConsumer.name);
  constructor(
      private readonly siteContentService: SiteContentService,
      private readonly httpService: HttpService,
      private readonly telegramService: TelegramBotService
  ) {}

  @OnQueueCompleted()
  async onComplete(job: Job<any>, result: any) {
    this.logger.log(
      `Job complete with post ${job.data.post._id}`,
    );
  }

  @OnQueueFailed()
  async onFailed(job: Job<any>, error) {
    this.logger.error(`Job failed with post ${job.data.post._id}`);
    this.logger.error(error.message  || error.toString())
    await this.telegramService.sendLogToTelegram(`Get content using chatgpt for post with title: ${job.data.post.title} | Error: ${error.message || error.toString()}`)
  }

  @Process({
    name: POSTS_QUEUE.INSERT_STATS_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async insertStats(job: Job<any>) {
    const { post, site } = job.data
    try {
       const postUpdateStatus = await this.siteContentService.updateStatus(post._id, {
         status: [ContentStatus.PROCESSING]
       })
      const postUpdated = await this.sendToChatGPT(postUpdateStatus)
      if(post.post_id) {
        await this.siteContentService.updatePostToSiteJob({post: postUpdated, site})
      } else {
        await this.siteContentService.sendPostToSiteJob({post: postUpdated, site})
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async sendToChatGPT(post: SiteContent) {
    try {
      const data = {
        model: process.env.CHATGPT_MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: post.question }
        ]
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${process.env.CHATGPT_KEY}`,
          'Content-Type': 'application/json'
        }
      };
      const res = await this.httpService.post('https://api.openai.com/v1/chat/completions', data, config).toPromise()

      const updateContentStatus: UpdatePostStatusDto = {
        status: [...post.status, ContentStatus.SEND_CHATGPT_SUCCESS],
        content: res.data.choices[0].message.content,
      }
      return await this.siteContentService.updateStatus(post._id, updateContentStatus)

    } catch (e) {
      const updateContentStatus: UpdatePostStatusDto = {
        status: [...post.status, ContentStatus.SEND_CHATGPT_FAILED],
      }
      await this.siteContentService.updateStatus(post._id, updateContentStatus)
      throw new Error(e);
    }
  }
}
