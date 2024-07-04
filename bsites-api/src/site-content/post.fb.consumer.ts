import {OnQueueCompleted, OnQueueFailed, Process, Processor,} from '@nestjs/bull';
import {Job} from 'bull';
import {Injectable, Logger} from '@nestjs/common';
import {POSTS_SEND_TO_FB_QUEUE} from './constants';
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
  name: POSTS_SEND_TO_FB_QUEUE.INSERT_STATS_QUEUE,
})
@Injectable()
export class PostFbConsumer {
  private readonly logger = new Logger(PostFbConsumer.name);
  constructor(
      private readonly siteContentService: SiteContentService,
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
    name: POSTS_SEND_TO_FB_QUEUE.SEND_POST_TO_GROUP,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async sendPostToFBGroup(job: Job<any>) {
    const { payload: post, post: postCreate, site } = job.data

    // let postCreate = await this.siteContentService.updateStatus(postContent._id, {
    //   fb_status: [ContentStatus.PROCESSING]
    // })
    await this.telegramService.sendLogToTelegram(`==== Start to send post to fb page ====`)

    const page = await this.pageService.findOne(post.page_id)

    if(!page) {
      // await this.siteContentService.updateStatus(postContent._id, {
      //   fb_status: [...postCreate.fb_status, ContentStatus.SEND_POST_TO_GROUP_FAILED]
      // })
      await this.telegramService.sendLogToTelegram(`Page is not existed with id ${post.page_id}`)

      throw new Error(`Page is not existed with id ${post.page_id}`);
    }

    const dataUpload = await this.sendUploadImage(page, post, postCreate)

    if(dataUpload.id && dataUpload.post_id && !post.schedule_time) {
      if(!!post.comment) {
        await this.siteContentService.sendCommentToPost({
          payload: {
            post_id: dataUpload.post_id, page_id: post.page_id, comment: post.comment
          },
          post: postCreate,
          site
        })
      }
      return
    }

    const url = `https://graph.facebook.com/${page.page_id}/feed`
    const payload : any = {
      message: `${post.title}\n\n${post.caption}`,
      access_token: page.access_token,
      attached_media: JSON.stringify([{ media_fbid: dataUpload.id }]),
      scheduled_publish_time: post.schedule_time,
      published: false
    }

    try {
      const { data } = await this.httpService.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).toPromise()

      // postCreate = await this.siteContentService.updateStatus(postContent._id, {
      //   fb_status: [...postCreate.fb_status, ContentStatus.SEND_POST_TO_GROUP_SUCCESS]
      // })
      await this.telegramService.sendLogToTelegram(`Created a SCHEDULED POST to group ${page.page_name}, Title: ${post.title}`)


      if(!!post.comment) {
        await this.siteContentService.sendCommentToPost({
          payload: {
            post_id: data.id, page_id: post.page_id, comment: post.comment
          },
          post: postCreate,
          site
        })
      }

    } catch (e) {
      // await this.siteContentService.updateStatus(postContent._id, {
      //   fb_status: [...postCreate.fb_status, ContentStatus.SEND_POST_TO_GROUP_FAILED]
      // })
      await this.telegramService.sendLogToTelegram(`Cannot create a SCHEDULED POST to group ${page.page_name}, Title: ${post.title}, Error: ${e.toString()}`)

      throw new Error(`Cannot send post to group ${page.page_name}, Error: ${e}`);
    }
  }


  @Process({
    name: POSTS_SEND_TO_FB_QUEUE.SEND_COMMENT_TO_POST,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async sendCommentToPost(job: Job<any>) {
    const { payload: data, post: postContent, site } = job.data
    const page = await this.pageService.findOne(data.page_id)

    const url = `https://graph.facebook.com/${data.post_id}/comments?access_token=${page.access_token}&message=${data.comment}`

    try {
      await this.httpService.post(url, null, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).toPromise()


      await this.telegramService.sendLogToTelegram(`Send COMMENT: ${data.comment} success to post ${data.post_id} on page: ${page.page_name}`)

      // await this.siteContentService.updateStatus(postContent._id, {
      //   fb_status: [...postContent.fb_status, ContentStatus.SEND_COMMENT_TO_POST_SUCCESS]
      // })

    } catch (e) {
      // await this.siteContentService.updateStatus(postContent._id, {
      //   fb_status: [...postContent.fb_status, ContentStatus.SEND_COMMENT_TO_POST_FAILED]
      // })
      await this.telegramService.sendLogToTelegram(`Cannot send COMMENT to post ${data.post_id} in page: ${page.page_name} with comment: ${data.comment}, Error: ${e.toString()}`)
      throw new Error(`Cannot send comment to post ${data.post_id} in page ${page.page_name}, Error: ${e}`);
    }
  }

  async sendUploadImage(page: FbPage, payload: any, postContent: SiteContent) {

    const url = `https://graph.facebook.com/${page.page_id}/photos`
    const imageContent = fs.createReadStream(payload.imagePath)
    const form = new FormData();
    form.append('access_token', page.access_token);
    form.append('source', imageContent);
    form.append('caption',`${payload.title}\n\n${payload.caption}`)
    if(payload.schedule_time) {
      form.append('published', 'false'); // Upload the image but do not publish it yet
    }

    try {
      const { data } = await this.httpService.post(url, form, {
        headers: form.getHeaders()
      }).toPromise()

      if(!payload.schedule_time) {
        // await this.siteContentService.updateStatus(postContent._id, {
        //   fb_status: [...postContent.fb_status, ContentStatus.SEND_POST_TO_GROUP_SUCCESS]
        // })
        await this.telegramService.sendLogToTelegram(`Send A POST to fb page: ${page.page_name} success, Title: ${payload.title}`)
      }

      return data

    } catch (e) {
      // await this.siteContentService.updateStatus(postContent._id, {
      //   fb_status: [...postContent.fb_status, ContentStatus.SEND_POST_TO_GROUP_FAILED]
      // })
      await this.telegramService.sendLogToTelegram(`Cannot create A POST using image on page: ${page.page_name}, Title: ${payload.title}, Error: ${e.toString()}`)

      throw new Error(`Cannot upload image to post fb, Error: ${e}`);
    }
  }
}
