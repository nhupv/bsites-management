import {Injectable} from '@nestjs/common';
import {CreateFbPageDto} from './dto/create-fb-page.dto';
import {UpdateFbPageDto} from './dto/update-fb-page.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import {FbPage, FbPageDocument} from "./entities/fb-page.entity";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {PaginationResultInterface} from "../common/pagination/interface/pagination-result.interface";

@Injectable()
export class FbPageService {
  constructor(@InjectModel(FbPage.name) private fbPageDocumentModel: Model<FbPageDocument>) {
  }
  create(createFbPageDto: CreateFbPageDto) {
    const newPage = new this.fbPageDocumentModel(createFbPageDto)
    return newPage.save()
  }


  async find(options = {}) {
    const query = this.fbPageDocumentModel.find(options);
    return await query.exec()
  }

  async findAll(
      paginationParams: PaginationParams,
      filter: Array<any>,
      userId: string,
  ): Promise<PaginationResultInterface<FbPage>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.fbPageDocumentModel.find({ user: userId});
    // if (filter.length > 0) {
    //   query.and(filter);
    // }
    const data = await query
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: [sortType] })
        .exec();

    const total = await this.fbPageDocumentModel.countDocuments().exec();
    // const total =
    //     filter.length > 0
    //         ? await this.siteKeywordModel.countDocuments({ $and: filter }).exec()
    //         : await this.siteKeywordModel.countDocuments().exec();
    return { data, total };
  }

  async findAllNoPaging( paginationParams: PaginationParams, filter: Array<any>, userId: string) {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.fbPageDocumentModel.find({ user: userId});
    if (filter.length > 0) {
      query.and(filter);
    }
    return await query
        .sort({[sortBy]: [sortType]})
        .exec()
  }

  findOne(id: ObjectId | string): Promise<FbPage> {
    return this.fbPageDocumentModel.findById(id).exec();
  }

  findOneByID(id: ObjectId | string, userId: string): Promise<FbPage> {
    return this.fbPageDocumentModel.findOne({_id: id, user: userId}).exec();
  }

  updateMany(filter: any, updateFbPageDto: UpdateFbPageDto) {
    return this.fbPageDocumentModel.updateMany(filter, {$set: updateFbPageDto}).exec()
  }

  update(
      id: ObjectId | string,
      updateFbPageDto: UpdateFbPageDto,
  ): Promise<FbPage> {
    return this.fbPageDocumentModel
        .findOneAndUpdate(
            { _id: id },
            { $set: updateFbPageDto },
            {
              new: true,
            },
        )
        .exec();
  }

  remove(id: ObjectId) {
    return this.fbPageDocumentModel.findOneAndDelete({ _id: id });
  }
}
