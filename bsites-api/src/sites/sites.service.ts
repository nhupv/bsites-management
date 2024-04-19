import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Site, SiteDocument} from "./entities/site.entity";
import {Model, ObjectId} from "mongoose";
import {PaginationResultInterface} from "../common/pagination/interface/pagination-result.interface";
import {User} from "../users/entities/user.entity";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {Domain} from "../domain/entities/domain.entity";
import {UpdateDomainDto} from "../domain/dto/update-domain.dto";
import {UrlSite} from "../url-site/entities/url-site.entity";

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private  siteModel : Model<SiteDocument>) {
  }
  create(createSiteDto: CreateSiteDto) {
    const site = new this.siteModel(createSiteDto);
    return site.save();
  }

  async findAll(
      paginationParams: PaginationParams,
      filter: Array<any>,
  ): Promise<PaginationResultInterface<Site>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.siteModel.find();
    // if (filter.length > 0) {
    //   query.and(filter);
    // }
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


  findOne(id: ObjectId | string): Promise<Site> {
    return this.siteModel.findById(id).exec();
  }

  findByUrl(url: string): Promise<Site> {
    return this.siteModel.findOne({siteUrl: url}).populate(['urls', 'keywords','proxies']).exec();
  }


  // update(id: ObjectId, updateSiteDto: UpdateSiteDto) {
  //   return this.siteModel.findOneAndUpdate({ _id: id }, updateSiteDto, {
  //     new: true,
  //   });
  // }

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

  remove(id: ObjectId) {
    return this.siteModel.findOneAndDelete({ _id: id });

  }
}
