import {InjectQueue, OnQueueCompleted, OnQueueFailed, Process, Processor,} from '@nestjs/bull';
import {Job, Queue} from 'bull';
import {Injectable, Logger} from '@nestjs/common';
// import { CreateDashboardDto } from "./dto/create-dashboard.dto";
import {TelegramBotService} from "../../telegram/telegram.service";
import {HttpService} from "@nestjs/axios";
import * as fs from "node:fs";
import path from "node:path";
import e from "express";
import {JOBS_NAME, JOBS_QUEUE} from "../constants";
import {JobsService} from "../jobs.service";
import {SiteContentService} from "../../site-content/site-content.service";
import {parseJsonFromString} from "../../common/helpers/file-helpers";

@Processor({
  name: JOBS_QUEUE.ADD_POST_QUEUE,
})
@Injectable()
export class PostJobConsumer {
  private readonly logger = new Logger(PostJobConsumer.name);
  constructor(
      private readonly telegramService: TelegramBotService,
      private readonly jobService: JobsService,
      private readonly siteContentService: SiteContentService
  ) {}

  @OnQueueCompleted()
  async onComplete(job: Job<any>, result: any) {
    this.logger.log(
      `Added post to fb job to queue ${job.id}`,
    );
  }

  @OnQueueFailed()
  async onFailed(job: Job<any>, error) {
    this.logger.error(`Job failed, data: ${job.id}`);
    this.logger.error(error.message  || error.toString())
    await this.telegramService.sendLogToTelegram(`Add create fb job to queue failed: ${job.id} | Error: ${error.message || error.toString()}`)
  }

  @Process({
    name: JOBS_NAME.ADD_POST_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async addPostJob(job: Job<any>) {
    const compressJob = await this.jobService.addChatGPTJob({prompt: job.data.caption_prompt})
    const caption = await compressJob.finished()
    console.log(caption)

    const pages: Array<any> = parseJsonFromString(job.data.pages)
    if(pages.length === 0) {
      throw new Error('Page list is empty!')
    }

    pages.forEach((item:any) => {
      const payload = {
        title: caption,
        caption: '',
        schedule_time: item.scheduled_time,
        page_id: item.page_id,
        page_name: item.page_name,
        imagePath: job.data.imagePath,
        comment: job.data.url
      }
      this.siteContentService.sendPostToFbGroup({ payload })
    })
  }
}
