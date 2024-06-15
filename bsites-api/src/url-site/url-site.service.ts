import {BadRequestException, Inject, Injectable, Scope} from '@nestjs/common';
import {CreateUrlSiteDto} from './dto/create-url-site.dto';
import {UpdateUrlSiteDto} from './dto/update-url-site.dto';
import {InjectModel} from "@nestjs/mongoose";
import {UrlSite, UrlSiteDocument} from "./entities/url-site.entity";
import mongoose, {Model, ObjectId, Types} from "mongoose";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {PaginationResultInterface} from "../common/pagination/interface/pagination-result.interface";
import {REQUEST} from "@nestjs/core";
import { Request } from 'express'
import {HttpService} from "@nestjs/axios";
import {UpdatePostStatusDto} from "../site-content/dto/update-post-status.dto";
import {SiteContent} from "../site-content/entities/site-content.entity";
import {UpdateUrlPriorityDto} from "./dto/update-url-priority.dto";

@Injectable({ scope: Scope.REQUEST})
export class UrlSiteService {
  constructor(@InjectModel(UrlSite.name) private urlSiteModel: Model<UrlSiteDocument>,
              private readonly httpService: HttpService,
              @Inject(REQUEST) private request: Request) {
  }
  create(createUrlSiteDto: CreateUrlSiteDto) {
    const newUrl = new this.urlSiteModel(createUrlSiteDto)
    return newUrl.save()
  }

  async createBulk(siteUrlList: Array<CreateUrlSiteDto>) {
    // console.log(trackingDomainList);
    // const session = await this.connection.startSession();
    // session.startTransaction();
    try {
      // const tD = await this.trackingDomainModel.insertMany(trackingDomainList, {
      //   session,
      // });
      const tD = await this.urlSiteModel.insertMany(siteUrlList);
      // await session.commitTransaction();
      return tD;
    } catch (e) {
      // await session.abortTransaction();
      throw new BadRequestException('Insert error!');
    } finally {
      // session.endSession();
    }
  }

  async findAll(
      paginationParams: PaginationParams,
      filter: Array<any>,
  ): Promise<PaginationResultInterface<UrlSite>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.urlSiteModel.find({ site: this.request.params.siteId});
    // if (filter.length > 0) {
    //   query.and(filter);
    // }
    const data = await query
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: [sortType] })
        .populate('site')
        .exec();

    const total = await this.urlSiteModel.countDocuments({ site: this.request.params.siteId}).exec()
    // const total =
    //     filter.length > 0
    //         ? await this.urlSiteModel.countDocuments({ $and: filter }).exec()
    //         : await this.urlSiteModel.countDocuments().exec();
    return { data, total };
  }

  findOne(id: ObjectId) {
    return this.urlSiteModel.findOne({_id: id, site: this.request.params.siteId}).populate('site').exec();
  }

  findBySiteId(id: string){
    return this.urlSiteModel.find({ site: id}).exec()
  }

  update(
      id: ObjectId | string,
      updateUrlSiteDto: UpdateUrlSiteDto,
  ): Promise<UrlSite> {
    return this.urlSiteModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updateUrlSiteDto },
            {
              new: true,
            },
        ).populate('site')
        .exec();
  }

  updatePriority(
      id: ObjectId | string,
      updateUrlPriorityDto: UpdateUrlPriorityDto,
  ): Promise<UrlSite> {
    return this.urlSiteModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updateUrlPriorityDto },
            {
              new: true,
            },
        ).populate('site')
        .exec();
  }

  remove(id: ObjectId) {
    return this.urlSiteModel.findOneAndDelete({ _id: id });
  }

  removeAll() {
    return this.urlSiteModel.remove({site: this.request.params.siteId}).exec();
  }

  async pushData(ip:string) {
    const urls = await this.findBySiteId(this.request.params.siteId)
    const listUrl = urls.map(url => ({url: url.url, priority: url.priority ? 1 : 0}))
    return this.httpService
        .post(
            `http://${ip}:5000/sync_url`,
            listUrl,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }
}
