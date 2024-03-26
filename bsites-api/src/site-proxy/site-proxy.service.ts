import {BadRequestException, Inject, Injectable, Scope} from '@nestjs/common';
import {CreateSiteProxyDto} from './dto/create-site-proxy.dto';
import {UpdateSiteProxyDto} from './dto/update-site-proxy.dto';
import {InjectModel} from "@nestjs/mongoose";
import {SiteProxy, SiteProxyDocument} from "./entities/site-proxy.entity";
import {Model, ObjectId, Types} from "mongoose";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {PaginationResultInterface} from "../common/pagination/interface/pagination-result.interface";
import {REQUEST} from "@nestjs/core";
import { Request } from 'express'
import {CreateUrlSiteDto} from "../url-site/dto/create-url-site.dto";

@Injectable({ scope: Scope.REQUEST})
export class SiteProxyService {
  constructor(@InjectModel(SiteProxy.name) private siteProxyModel: Model<SiteProxyDocument>,
              @Inject(REQUEST) private request: Request) {
  }
  create(createSiteProxyDto: CreateSiteProxyDto) {
    const newUrl = new this.siteProxyModel(createSiteProxyDto)
    return newUrl.save()
  }

  async createBulk(siteProxyList: Array<CreateSiteProxyDto>) {
    // console.log(trackingDomainList);
    // const session = await this.connection.startSession();
    // session.startTransaction();
    try {
      // const tD = await this.trackingDomainModel.insertMany(trackingDomainList, {
      //   session,
      // });
      const tD = await this.siteProxyModel.insertMany(siteProxyList);
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
  ): Promise<PaginationResultInterface<SiteProxy>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.siteProxyModel.find({site: this.request.params.obSiteId});
    // if (filter.length > 0) {
    //   query.and(filter);
    // }
    const data = await query
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: [sortType] })
        .populate('site')
        .exec();
    const total =
        filter.length > 0
            ? await this.siteProxyModel.countDocuments({site: this.request.params.obSiteId, $and: filter }).exec()
            : await this.siteProxyModel.countDocuments({site: this.request.params.obSiteId}).exec();
    return { data, total };
  }

  findOne(id: ObjectId) {
    const siteId = Types.ObjectId.createFromHexString(this.request.params.siteId)
    return this.siteProxyModel.findOne({_id: id, site: siteId}).populate('site').exec();
  }

  update(
      id: ObjectId | string,
      updateSiteProxyDto: UpdateSiteProxyDto,
  ): Promise<SiteProxy> {
    return this.siteProxyModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updateSiteProxyDto },
            {
              new: true,
            },
        )
        .populate('site')
        .exec();
  }

  remove(id: ObjectId) {
    return this.siteProxyModel.findOneAndDelete({ _id: id });

  }
  removeAll() {
    return this.siteProxyModel.remove({});
  }

}
