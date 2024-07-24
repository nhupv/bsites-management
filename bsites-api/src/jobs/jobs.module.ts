import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TelegramBotModule } from '../telegram/telegram.module';
import * as moment from 'moment-timezone';
import {ConsoleModule} from "nestjs-console";
import {BullModule} from "@nestjs/bull";
import {JOBS_QUEUE} from "./constants";
import {ChatgptConsumer} from "./consumer/chatgpt.consumer";
import {HttpModule} from "@nestjs/axios";
import {PostJobConsumer} from "./consumer/postJob.consumer";
import {SiteContentModule} from "../site-content/site-content.module";
import {POSTS_SEND_TO_FB_QUEUE} from "../site-content/constants";

@Module({
  imports: [
    TelegramBotModule,
    HttpModule,
    SiteContentModule,
    BullModule.registerQueue({
      name: JOBS_QUEUE.CHATGPT_QUEUE,
    },{
      name: JOBS_QUEUE.ADD_POST_QUEUE,
    },{
      name: POSTS_SEND_TO_FB_QUEUE.INSERT_STATS_QUEUE
    })],
  controllers: [JobsController],
  providers: [
    JobsService,
    ChatgptConsumer,
    PostJobConsumer
  ],
  exports: [JobsService]
})
export class JobsModule {}
