import { Inject, Injectable, Logger } from '@nestjs/common';
import { Console, Command } from 'nestjs-console';
import {JOBS_NAME, JOBS_QUEUE} from "./constants";
import {InjectQueue} from "@nestjs/bull";
import {JobStatus, Queue} from "bull";
import {POSTS_SEND_TO_FB_QUEUE} from "../site-content/constants";

@Console()
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
      @InjectQueue(JOBS_QUEUE.CHATGPT_QUEUE)
      private addChatGptJob: Queue,
      @InjectQueue(JOBS_QUEUE.ADD_POST_QUEUE)
      private addPostJob: Queue,
      @InjectQueue(POSTS_SEND_TO_FB_QUEUE.INSERT_STATS_QUEUE)
      private postToPageQueue: Queue,

) {}
  async addChatGPTJob(data: any) {
    return await this.addChatGptJob.add(JOBS_NAME.CHATGPT_JOB, data);
  }

  async addPostJobToQueue(data: any) {
    return await this.addPostJob.add(JOBS_NAME.ADD_POST_JOB, data);
  }

  async getPostQueueList(types: Array<JobStatus>) {
    return await this.addPostJob.getJobs(types);
  }

  async getChatGptQueueList(types: Array<JobStatus>) {
    return await this.addChatGptJob.getJobs(types);
  }

  async getPostToPageQueueList(types: Array<JobStatus>) {
    return await this.postToPageQueue.getJobs(types);
  }
}
