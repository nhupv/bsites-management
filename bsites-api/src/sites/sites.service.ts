import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Site, SiteDocument} from "./entities/site.entity";
import {Model, ObjectId} from "mongoose";
import {PaginationResultInterface} from "../common/pagination/interface/pagination-result.interface";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {ChangeSiteStatusDto} from "./dto/change-site-status.dto";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private  siteModel : Model<SiteDocument>,
              private readonly httpService: HttpService,
  ) {
  }
  create(createSiteDto: CreateSiteDto) {
    const site = new this.siteModel(createSiteDto);
    return site.save();
  }

  findAllWithoutPagination(): Promise<Site[]> {
    return this.siteModel.find({ status: true }).exec();
  }

  async findAll(
      paginationParams: PaginationParams,
      filter: Array<any>,
      id: string
  ): Promise<PaginationResultInterface<Site>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.siteModel.find({user: id});
    if (filter.length > 0) {
      query.and(filter);
    }
    const data = await query
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: [sortType] })
        .exec();
    const total =
        filter.length > 0
            ? await this.siteModel.countDocuments({ $and: filter }).exec()
            : await this.siteModel.countDocuments().exec();
    return { data, total };
  }


  findOne(id: ObjectId | string, userId: string): Promise<Site> {
    return this.siteModel.findOne({_id: id, user: userId}).exec();
  }

  findOneSiteActive(id: ObjectId | string, userId: string): Promise<Site> {
    return this.siteModel.findOne({ _id: id, status: true, user: userId }).exec();
  }

  findByUrl(url: string): Promise<Site> {
    return this.siteModel.findOne({siteUrl: url}).populate(['urls', 'keywords','proxies']).exec();
  }

  changeStatus(id: ObjectId | string, userId: string, changeStatus: ChangeSiteStatusDto): Promise<Site> {
    return this.siteModel
        .findOneAndUpdate(
            { _id: id, user: userId },
            { $set: changeStatus },
            {
              new: true,
            },
        )
        .exec();
  }

  update(
      id: ObjectId | string,
      updateSiteDto: UpdateSiteDto,
  ): Promise<Site> {
    return this.siteModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updateSiteDto },
            {
              new: true,
            },
        )
        .exec();
  }

  updateMany(
      updateStatus: ChangeSiteStatusDto,
  ) {
    return this.siteModel
        .updateMany({}, {$set: updateStatus}).exec()
  }

  remove(id: ObjectId) {
    return this.siteModel.findOneAndDelete({ _id: id });
  }

  getCategoryInSite(site: Site) {
    const wpUrl = `${site.siteUrl}/wp-json/wp/v2/categories`;
    const auth = Buffer.from(`${site.username}:${site.password}`).toString('base64');
    return this.httpService
        .get(
            wpUrl,
            {
              headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
              },
            },
        )
        .toPromise();
  }

}
