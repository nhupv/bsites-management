import {BadRequestException, Inject, Injectable, Scope} from '@nestjs/common';
import { CreateSiteContentDto } from './dto/create-site-content.dto';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';
import {Model, ObjectId} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {SiteContent, SiteContentDocument} from "./entities/site-content.entity";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {PaginationResultInterface} from "../common/pagination/interface/pagination-result.interface";
import {Site} from "../sites/entities/site.entity";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {POSTS_QUEUE, POSTS_SEND_TO_SITE_QUEUE} from "./constants";
import {UpdatePostStatusDto} from "./dto/update-post-status.dto";

@Injectable()
export class SiteContentService {
  constructor(@InjectModel(SiteContent.name) private siteContentModel: Model<SiteContentDocument>,
              @InjectQueue(POSTS_QUEUE.INSERT_STATS_QUEUE)
              private queue: Queue,
              @InjectQueue(POSTS_SEND_TO_SITE_QUEUE.INSERT_STATS_QUEUE)
              private queueSend: Queue
             ) {
  }
  create(createSiteContentDto: CreateSiteContentDto) {
    const newContent = new this.siteContentModel(CreateSiteContentDto)
    return newContent.save()
  }

  async createBulk(siteContentList: Array<CreateSiteContentDto>) {
    // console.log(trackingDomainList);
    // const session = await this.connection.startSession();
    // session.startTransaction();
    try {
      // const tD = await this.trackingDomainModel.insertMany(trackingDomainList, {
      //   session,
      // });
      const tD = await this.siteContentModel.insertMany(siteContentList);
      // await session.commitTransaction();
      return tD;
    } catch (e) {
      // await session.abortTransaction();
      console.log(e)
      throw new BadRequestException('Insert error!');
    } finally {
      // session.endSession();
    }
  }

  async findAll(
      paginationParams: PaginationParams,
      site: Site,
      filter: Array<any>,
  ): Promise<PaginationResultInterface<SiteContent>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.siteContentModel.find({ site: site._id});
    // if (filter.length > 0) {
    //   query.and(filter);
    // }
    const data = await query
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: [sortType] })
        .populate('site')
        .exec();

    const total = await this.siteContentModel.countDocuments({ site: site._id}).exec()
    // const total =
    //     filter.length > 0
    //         ? await this.siteContentModel.countDocuments({ $and: filter }).exec()
    //         : await this.siteContentModel.countDocuments().exec();
    return { data, total };
  }

  findOne(id: ObjectId, site: Site) {
    return this.siteContentModel.findOne({_id: id, site: site._id}).populate('site').exec();
  }

  update(
      id: ObjectId | string,
      updateSiteContentDto: UpdateSiteContentDto,
  ): Promise<SiteContent> {
    return this.siteContentModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updateSiteContentDto },
            {
              new: true,
            },
        ).populate('site')
        .exec();
  }

  updateStatus(
      id: ObjectId | string,
      updatePostStatusDto: UpdatePostStatusDto,
  ): Promise<SiteContent> {
    return this.siteContentModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updatePostStatusDto },
            {
              new: true,
            },
        ).populate('site')
        .exec();
  }

  remove(id: ObjectId | string) {
    return this.siteContentModel.findOneAndDelete({ _id: id });
  }

  async insertPostJob(data: any) {
    await this.queue.add(POSTS_QUEUE.INSERT_STATS_JOB, data);
  }

  async sendPostToSiteJob(data: any) {
    await this.queueSend.add(POSTS_SEND_TO_SITE_QUEUE.INSERT_STATS_JOB, data);
  }

  async updatePostToSiteJob(data: any) {
    await this.queueSend.add(POSTS_SEND_TO_SITE_QUEUE.INSERT_UPDATE_JOB, data);
  }

  async deletePostToSiteJob(data: any) {
    await this.queueSend.add(POSTS_SEND_TO_SITE_QUEUE.INSERT_DELETE_JOB, data);
  }

}
