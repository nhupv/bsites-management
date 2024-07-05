import {OnQueueCompleted, OnQueueFailed, Process, Processor,} from '@nestjs/bull';
import {Job} from 'bull';
import {Injectable, Logger} from '@nestjs/common';
import {POSTS_QUEUE, POSTS_SEND_TO_SITE_QUEUE} from './constants';
import {SiteContentService} from "./site-content.service";
import {TelegramBotService} from "../telegram/telegram.service";
import {HttpService} from "@nestjs/axios";
import {ContentStatus} from "./enum/content-status-enum";
import {Site} from "../sites/entities/site.entity";
import {SiteContent} from "./entities/site-content.entity";
import {FbPageService} from "../fb-page/fb-page.service";

@Processor({
  name: POSTS_SEND_TO_SITE_QUEUE.INSERT_STATS_QUEUE,
})
@Injectable()
export class PostSendConsumer {
  private readonly logger = new Logger(PostSendConsumer.name);
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
    this.logger.error(`Job failed with post ${job.data.post?._id}`);
    this.logger.error(error.message  || error.toString())
    await this.telegramService.sendLogToTelegram(`Send post to ${job.data.site.siteUrl} failed with title: ${job.data.post.title} | Error: ${error.message || error.toString()}`)
  }

  @Process({
    name: POSTS_SEND_TO_SITE_QUEUE.INSERT_STATS_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async sendPost(job: Job<any>) {
    const { post, postFb, site, direct } = job.data
    console.log(postFb)

    let postCreate = {...post}
    if(direct) {
      postCreate = await this.siteContentService.updateStatus(postCreate._id, {
        status: [ContentStatus.PROCESSING]
      })
    }

    if(!postCreate.content) {
      await this.siteContentService.updateStatus(postCreate._id, {
        status: [...postCreate.status, ContentStatus.SEND_CONTENT_FAILED]
      })
      throw new Error('Content is empty!');
    }

    if(postCreate.post_id) {
      await this.siteContentService.updateStatus(postCreate._id, {
        status: [...postCreate.status, ContentStatus.SEND_CONTENT_FAILED]
      })
      throw new Error(`Post is existed with id ${postCreate.post_id}`);
    }
    try {
      const data = await this.sendPostToSite(postCreate, site)
      if(postFb.is_post_to_page) {
        if(postFb.comment) {
          postFb.comment = postFb.comment.replace("{link}", data.link)
        }
        await this.siteContentService.sendPostToFbGroup({payload: postFb, post: postCreate, site})
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async sendPostToSite(post: SiteContent, site: Site) {
    try {
      const url = `${site.siteUrl}/wp-json/wp/v2/posts`
      const payload = {
        title: post.title,
        content: post.content,
        status: 'publish',
        categories: post.category_id ? [post.category_id] : [],
      };
      const auth = Buffer.from(`${site.username}:${site.password}`).toString('base64');
      const { data } = await this.httpService.post(url, payload, {
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        }
      }).toPromise()

      const updateContentStatus = {
        status: [...post.status, ContentStatus.SEND_CONTENT_SUCCESS],
        link: data.link,
        post_id: data.id
      }
      await this.siteContentService.updateStatus(post._id, updateContentStatus)

      return data

    } catch (e) {
      const updateContentStatus = {
        status: [...post.status, ContentStatus.SEND_CONTENT_FAILED]
      }
      await this.siteContentService.updateStatus(post._id, updateContentStatus)
      throw new Error(e);
    }
  }

  @Process({
    name: POSTS_SEND_TO_SITE_QUEUE.INSERT_UPDATE_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async updatePost(job: Job<any>) {
    const { post, site, direct } = job.data
    let postUpdate = {...post}
    if(direct) {
      postUpdate = await this.siteContentService.updateStatus(post._id, {
        status: [ContentStatus.PROCESSING]
      })
    }
    if(!postUpdate.post_id) {
      await this.siteContentService.updateStatus(post._id, {
        status: [...postUpdate.status, ContentStatus.SEND_UPDATE_POST_FAILED]
      })
      throw new Error('Post id is empty!');
    }

    if(!postUpdate.content) {
      await this.siteContentService.updateStatus(post._id, {
        status: [...postUpdate.status, ContentStatus.SEND_UPDATE_POST_FAILED]
      })
      throw new Error('Content is empty!');
    }
    try {
      const data = await this.updatePostToSite(postUpdate, site)
    } catch (e) {
      throw new Error(e);
    }
  }

  async updatePostToSite(post: SiteContent, site: Site) {
    try {
      const url = `${site.siteUrl}/wp-json/wp/v2/posts/${post.post_id}`
      const payload = {
        title: post.title,
        content: post.content,
        status: 'publish',
        categories: post.category_id ? [post.category_id] : [],
      };
      const auth = Buffer.from(`${site.username}:${site.password}`).toString('base64');
      const { data } = await this.httpService.post(url, payload, {
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        }
      }).toPromise()

      const updateContentStatus = {
        status: [...post.status, ContentStatus.SEND_UPDATE_POST_SUCCESS],
        link: data.link,
        post_id: data.id
      }
      await this.siteContentService.updateStatus(post._id, updateContentStatus)
      return data

    } catch (e) {
      const updateContentStatus = {
        status: [...post.status, ContentStatus.SEND_UPDATE_POST_FAILED]
      }
      await this.siteContentService.updateStatus(post._id, updateContentStatus)
      throw new Error(e);
    }
  }

  @Process({
    name: POSTS_SEND_TO_SITE_QUEUE.INSERT_DELETE_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async deletePost(job: Job<any>) {
    const { post, site, direct } = job.data
    let postDelete = {...post}

    if(direct) {
      postDelete = await this.siteContentService.updateStatus(post._id, {
        status: [ContentStatus.PROCESSING]
      })
    }
    try {
      if(postDelete.post_id) {
        await this.deletePostToSite(postDelete, site)
      } else  {
        await this.siteContentService.remove(post._id)
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async deletePostToSite(post: SiteContent, site: Site) {
    try {
      const url = `${site.siteUrl}/wp-json/wp/v2/posts/${post.post_id}`
      const auth = Buffer.from(`${site.username}:${site.password}`).toString('base64');
      const data = await this.httpService.delete(url, {
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        }
      }).toPromise()

      await this.siteContentService.remove(post._id)

    } catch (e) {
      const updateContentStatus = {
        status: [...post.status, ContentStatus.SEND_DELETE_POST_FAILED]
      }
      await this.siteContentService.updateStatus(post._id, updateContentStatus)
      throw new Error(e);
    }
  }
}
