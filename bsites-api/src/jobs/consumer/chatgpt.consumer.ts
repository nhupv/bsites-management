import {OnQueueCompleted, OnQueueFailed, Process, Processor,} from '@nestjs/bull';
import {Job} from 'bull';
import {Injectable, Logger} from '@nestjs/common';
// import { CreateDashboardDto } from "./dto/create-dashboard.dto";
import {TelegramBotService} from "../../telegram/telegram.service";
import {HttpService} from "@nestjs/axios";
import * as fs from "node:fs";
import path from "node:path";
import e from "express";
import {JOBS_NAME, JOBS_QUEUE} from "../constants";

@Processor({
  name: JOBS_QUEUE.CHATGPT_QUEUE,
})
@Injectable()
export class ChatgptConsumer {
  private readonly logger = new Logger(ChatgptConsumer.name);
  constructor(
      private readonly httpService: HttpService,
      private readonly telegramService: TelegramBotService
  ) {}

  @OnQueueCompleted()
  async onComplete(job: Job<any>, result: any) {
    this.logger.log(
      `Get data using chatgpt success! Job complete with data ${job.id}`,
    );
  }

  @OnQueueFailed()
  async onFailed(job: Job<any>, error) {
    this.logger.error(`Job failed, data: ${job.id}`);
    this.logger.error(error.message  || error.toString())
    // await this.telegramService.sendLogToTelegram(`Get data using chatgpt failed: ${job.id} | Error: ${error.message || error.toString()}`)
  }

  @Process({
    name: JOBS_NAME.CHATGPT_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async sendToChatGPT(job: Job<any>) {

    const { prompt } = job.data
    // return 'hello world !';

    if(!prompt) {
      throw new Error('Prompt is empty!')
    }

    try {
      const data = {
        model: process.env.CHATGPT_MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ]
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${process.env.CHATGPT_KEY}`,
          'Content-Type': 'application/json'
        }
      };
      const res = await this.httpService.post('https://api.openai.com/v1/chat/completions', data, config).toPromise()
      return res.data.choices[0].message.content
    } catch (e) {
      throw new Error(e);
    }
  }
}
