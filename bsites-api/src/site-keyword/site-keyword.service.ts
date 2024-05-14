import {BadRequestException, Inject, Injectable, Scope} from '@nestjs/common';
import { CreateSiteKeywordDto } from './dto/create-site-keyword.dto';
import { UpdateSiteKeywordDto } from './dto/update-site-keyword.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId, Types} from "mongoose";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {PaginationResultInterface} from "../common/pagination/interface/pagination-result.interface";
import {SiteKeyword, SiteKeywordDocument} from "./entities/site-keyword.entity";
import {REQUEST} from "@nestjs/core";
import { Request } from 'express'
import {CreateSiteProxyDto} from "../site-proxy/dto/create-site-proxy.dto";
import {HttpService} from "@nestjs/axios";

@Injectable({ scope: Scope.REQUEST })

export class SiteKeywordService {
  constructor(@InjectModel(SiteKeyword.name) private siteKeywordModel: Model<SiteKeywordDocument>,
              private readonly httpService: HttpService,
              @Inject(REQUEST) private request: Request) {
  }
  create(createSiteKeywordDto: CreateSiteKeywordDto) {
    const newUrl = new this.siteKeywordModel(createSiteKeywordDto)
    return newUrl.save()
  }

  async createBulk(siteKeywordList: Array<CreateSiteKeywordDto>) {
    // console.log(trackingDomainList);
    // const session = await this.connection.startSession();
    // session.startTransaction();
    try {
      // const tD = await this.trackingDomainModel.insertMany(trackingDomainList, {
      //   session,
      // });
      const tD = await this.siteKeywordModel.insertMany(siteKeywordList);
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
  ): Promise<PaginationResultInterface<SiteKeyword>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.siteKeywordModel.find({site: this.request.params.obSiteId});
    // if (filter.length > 0) {
    //   query.and(filter);
    // }
    const data = await query
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: [sortType] })
        .populate('site')
        .exec();

    const total = await this.siteKeywordModel.countDocuments({site: this.request.params.obSiteId}).exec();
    // const total =
    //     filter.length > 0
    //         ? await this.siteKeywordModel.countDocuments({ $and: filter }).exec()
    //         : await this.siteKeywordModel.countDocuments().exec();
    return { data, total };
  }

  findOne(id: ObjectId) {
    const siteId = Types.ObjectId.createFromHexString(this.request.params.siteId)

    return this.siteKeywordModel.findOne({_id: id, site: siteId}).populate('site').exec();
  }

  findBySiteId(id: any){
    return this.siteKeywordModel.find({ site: id}).exec()
  }

  update(
      id: ObjectId | string,
      updateSiteKeywordDto: UpdateSiteKeywordDto,
  ): Promise<SiteKeyword> {
    return this.siteKeywordModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updateSiteKeywordDto },
            {
              new: true,
            },
        )
        .exec();
  }

  remove(id: ObjectId) {
    return this.siteKeywordModel.findOneAndDelete({ _id: id });
  }

  removeAll() {
    const siteId = Types.ObjectId.createFromHexString(this.request.params.siteId)

    return this.siteKeywordModel.remove({site: siteId}).exec();
  }

  async pushData(ip:string) {
    const siteId = Types.ObjectId.createFromHexString(this.request.params.siteId)
    const keywords = await this.findBySiteId(siteId)
    const listKeyword = keywords.map(({keyword}) => keyword)
    return this.httpService
        .post(
            `http://${ip}:5000/init_keywords`,
            { list_keyword: listKeyword },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }

}
