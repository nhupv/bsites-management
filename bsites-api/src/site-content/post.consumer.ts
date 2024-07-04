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
import {getParseLinkPrompt, getValueTitle} from "../common/helpers/file-helpers";
import * as fs from "node:fs";
import path from "node:path";
import e from "express";

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
    const { post, site, direct } = job.data
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

  @Process({
    name: POSTS_QUEUE.INSERT_POST_LINK_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async getLinkBeforeSend(job: Job<any>) {
    const { post, site } = job.data
    let postUpdate = { ...post }
    postUpdate = await this.siteContentService.updateStatus(post._id, {
      status: [ContentStatus.PROCESSING]
    })

    const matches = getValueTitle(post.question)
    const titleList = matches.map(item => item[1])
    if(titleList.length === 0) {
      await this.siteContentService.updateStatus(post._id, {
        status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
      })
      throw new Error('No title found in question!')
    }
    const posts = await this.siteContentService.findByTitle(titleList)

    if(posts.length === 0) {
      await this.siteContentService.updateStatus(post._id, {
        status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
      })
      throw new Error('Title not match!')
    }

    const isJobSuccess = posts.every(item => !!item.link)

    if(!isJobSuccess) {
      await this.siteContentService.updateStatus(post._id, {
        status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
      })
      throw new Error('Link in some post is empty!')
    }

    const postLinkList = matches.map(match => {
      const p = posts.find(post => post.title === match[1])
      return [...match, p.link]
    })

    let question = post.question

    for(let i = 0; i < postLinkList.length ; i++) {
      question = question.replace(postLinkList[i][0], postLinkList[i][postLinkList[i].length - 1])
    }

    if(getValueTitle(question).length > 0) {
      await this.siteContentService.updateStatus(post._id, {
        status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
      })
      throw new Error('Question is invalid!')
    }

    postUpdate = await this.siteContentService.updateStatus(post._id, {
      question,
      status: [...postUpdate.status, ContentStatus.GET_LINK_SUCCESS]
    })

    const postContent = await this.sendToChatGPT(postUpdate)

    if(postContent.post_id) {
      await this.siteContentService.updatePostToSiteJob({post: postContent, site})
    } else {
      await this.siteContentService.sendPostToSiteJob({post: postContent, site})
    }
  }



  @Process({
    name: POSTS_QUEUE.INSERT_PARSE_LINK_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async parseLinkBeforeSend(job: Job<any>) {
    const { post, site } = job.data
    let postUpdate = { ...post }
    postUpdate = await this.siteContentService.updateStatus(post._id, {
      status: [ContentStatus.PROCESSING]
    })

    const matches = getParseLinkPrompt(postUpdate.question)
    const linkList = matches.map(item => item[0])
    if(linkList.length === 0) {
      await this.siteContentService.updateStatus(postUpdate._id, {
        status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
      })
      throw new Error('No link found in prompt!')
    }

    const linkImageList = []

    for (const link of linkList) {
      const data: any = await this.downloadImage(link)
      if(data.isError) {
        await this.siteContentService.updateStatus(postUpdate._id, {
          status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
        })
        throw new Error(`${data.error}`)
      } else {
        linkImageList.push(data)
      }
    }


    // const posts = await this.siteContentService.findByTitle(titleList)
    //
    if(linkImageList.length !== matches.length) {
      await this.siteContentService.updateStatus(postUpdate._id, {
        status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
      })
      throw new Error('DownLoad image error!')
    }

    const linkImageSite = []

    for (const link of linkImageList) {
      const data: any = await this.uploadImage(link.imageName, link.path, link.mimeType, site)
      if(data.isError) {
        await this.siteContentService.updateStatus(postUpdate._id, {
          status: [...postUpdate.status, ContentStatus.UPLOAD_IMAGE_FAILED]
        })
        throw new Error(`${data.error}`)
      } else {
        linkImageSite.push(data)
      }
    }

    if(linkImageSite.length !== matches.length) {
      await this.siteContentService.updateStatus(postUpdate._id, {
        status: [...postUpdate.status, ContentStatus.UPLOAD_IMAGE_FAILED]
      })
      throw new Error('Some link uploaded error!')
    }


    const postLinkList = matches.map((match, index) => {
      // const p = linkImageSite.find(post => post.title === match[1])
      return [...match, linkImageSite[index].url]
    })

    let question = post.question


    for(let i = 0; i < postLinkList.length ; i++) {
      question = question.replace(postLinkList[i][0], postLinkList[i][postLinkList[i].length - 1])
    }


    // if(getParseLinkPrompt(question).length > 0) {
    //   await this.siteContentService.updateStatus(post._id, {
    //     status: [...postUpdate.status, ContentStatus.GET_LINK_FAILED]
    //   })
    //   throw new Error('Prompt is invalid!')
    // }

    postUpdate = await this.siteContentService.updateStatus(post._id, {
      question,
      status: [...postUpdate.status, ContentStatus.GET_LINK_SUCCESS]
    })

    const postContent = await this.sendToChatGPT(postUpdate)

    if(postContent.post_id) {
      await this.siteContentService.updatePostToSiteJob({post: postContent, site})
    } else {
      await this.siteContentService.sendPostToSiteJob({post: postContent, site})
    }
  }

  async downloadImage(url: string) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const extension = this.getExtensionFromUrl(url)
    const imageName = `image_${timestamp}.${extension}`;
    const outputPath = path.resolve(`./uploads/${imageName}`);
    let mimeType = ''

    const writer = fs.createWriteStream(outputPath);

    try {
      const response = await this.httpService.get(url, { responseType: 'stream'}).toPromise();
      response.data.pipe(writer);
      mimeType = response.headers['content-type'] || 'image/jpeg';
    } catch (e) {
      throw new Error(`Error while downloading image: ${e}`);
    }

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({isError: false, error: null, imageName, mimeType, link: url, path: outputPath}));
      writer.on('error', () => reject({ isError: true, error: `Download error image: ${url}` }));
    });
  }

  getExtensionFromUrl(url) {
    // Use URL constructor to parse the URL
    const parsedUrl = new URL(url);

    // Get the pathname from the URL (this includes the file name)
    const pathname = parsedUrl.pathname;

    // Find the last occurrence of "." in the pathname to get the extension
    const extension = pathname.substring(pathname.lastIndexOf('.') + 1);

    // If there's no "." in the pathname, the URL doesn't have an extension
    if (extension === pathname) {
      return null;
    }

    return extension.toLowerCase(); // Return extension in lowercase
  }

  async uploadImage(imageName: string, path: string, mimeType: string, site: Site) {
      try {
        const imageData = fs.readFileSync(path);

        const response = await this.httpService.post(
            `${site.siteUrl}/wp-json/wp/v2/media`,
            imageData,
            {
              headers: {
                'Content-Disposition': `attachment; filename="${imageName}"`,
                'Content-Type': mimeType,
                'Authorization': `Basic ${Buffer.from(`${site.username}:${site.password}`).toString('base64')}`
              }
            }
        ).toPromise();
        return { isError: false, url: response.data.source_url, path, imageName }
      } catch (e) {
        return {
          isError: true,
          error: e
        }
      }
  }
}
