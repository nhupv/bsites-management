import { Module } from '@nestjs/common';
import { SiteContentService } from './site-content.service';
import { SiteContentController } from './site-content.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SiteContent, SiteContentSchema} from "./entities/site-content.entity";
import {SitesModule} from "../sites/sites.module";
import {BullModule} from "@nestjs/bull";
import {POSTS_QUEUE, POSTS_SEND_TO_FB_QUEUE, POSTS_SEND_TO_SITE_QUEUE} from "./constants";
import {TelegramBotModule} from "../telegram/telegram.module";
import {PostConsumer} from "./post.consumer";
import {HttpModule} from "@nestjs/axios";
import {PostSendConsumer} from "./post.send.consumer";
import {FbPageModule} from "../fb-page/fb-page.module";
import {PostFbConsumer} from "./post.fb.consumer";

@Module({
  imports:[
    BullModule.registerQueue({
      name: POSTS_QUEUE.INSERT_STATS_QUEUE,
    }, {
      name: POSTS_SEND_TO_SITE_QUEUE.INSERT_STATS_QUEUE,
    }, {
      name: POSTS_SEND_TO_FB_QUEUE.INSERT_STATS_QUEUE,
    }),
    HttpModule,
    MongooseModule.forFeature([
      { name: SiteContent.name, schema: SiteContentSchema },
    ]),
    SitesModule,
    FbPageModule,
    TelegramBotModule
  ],
  controllers: [SiteContentController],
  providers: [SiteContentService, PostConsumer, PostSendConsumer, PostFbConsumer],
  exports: [SiteContentService],
})
export class SiteContentModule {}
