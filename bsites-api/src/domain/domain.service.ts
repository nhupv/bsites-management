import { Injectable } from '@nestjs/common';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Domain, DomainDocument } from './entities/domain.entity';
import { PaginationResultInterface } from '../common/pagination/interface/pagination-result.interface';
import { PaginationParams } from '../common/pagination/dto/papgination-params.dto';
import { UpdateTotalDomainDto } from './dto/update-total-domain.dto';
import * as Excel from 'exceljs';
@Injectable()
export class DomainService {
  constructor(
    @InjectModel('Domain') private domainModel: Model<DomainDocument>,
  ) {}
  create(createDomainDto: CreateDomainDto): Promise<Domain> {
    const newDomain = new this.domainModel(createDomainDto);
    return newDomain.save();
  }
  async getTotal(): Promise<number> {
    return await this.domainModel.countDocuments().exec();
  }

  async findAll(
    paginationParams: PaginationParams,
    filter: Array<any>,
  ): Promise<PaginationResultInterface<Domain>> {
    const { skip, perPage, sortBy, sortType } = paginationParams;
    const query = this.domainModel.find();
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
        ? await this.domainModel.countDocuments({ $and: filter }).exec()
        : await this.domainModel.countDocuments().exec();
    return { data, total };
  }
  async getTopMatched() {
    try {
      return await this.domainModel.aggregate([
        {
          $lookup: {
            from: 'backlinks',
            localField: 'auctionId',
            foreignField: 'target_kwd',
            as: 'domainBacklink',
          },
        },
        {
          $unwind: {
            path: '$domainBacklink',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'trackingdomains',
            localField: 'domainBacklink.domain',
            foreignField: 'domain',
            as: 'trackingDomains',
          },
        },
        {
          $unwind: {
            path: '$trackingDomains',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              auctionId: '$auctionId',
              trackingDomain: '$trackingDomains.domain',
            },
            // domain: { $first: '$domains' },
            domain: { $first: '$$ROOT' },
          },
        },
        {
          $group: {
            _id: '$_id.auctionId',
            totalMatched: {
              $sum: {
                $cond: [{ $ifNull: ['$_id.trackingDomain', false] }, 1, 0],
              },
            },
            domain: { $first: '$domain' },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$domain', { totalMatched: '$totalMatched' }],
            },
          },
        },
        {
          $unset: ['trackingDomains', 'domainBacklink'],
        },
        {
          $sort: { totalMatched: -1 },
        },
        { $limit: 20 },
      ]);
    } catch (e) {
      console.log(e);
    }
  }
  findByAuctionId(auctionId: number): Promise<Domain> {
    return this.domainModel.findOne({ auctionId }).exec();
  }
  findByDomainName(name: string): Promise<Domain> {
    return this.domainModel.findOne({ name }).exec();
  }
  findOne(id: ObjectId): Promise<Domain> {
    return this.domainModel.findById(id).exec();
  }

  updateByAuctionId(
    auctionId: number,
    updateDomainDto: UpdateTotalDomainDto,
  ): Promise<Domain> {
    return this.domainModel
      .findOneAndUpdate(
        { auctionId },
        { $set: updateDomainDto },
        {
          new: true,
        },
      )
      .exec();
  }

  update(
    id: ObjectId | string,
    updateDomainDto: UpdateDomainDto,
  ): Promise<Domain> {
    return this.domainModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateDomainDto },
        {
          new: true,
        },
      )
      .exec();
  }
  async exportExcelFile(
    paginationParams: PaginationParams,
    filter: Array<any>,
  ) {
    try {
      let rows = [];
      let hasPage = true;
      paginationParams.page = 1;
      paginationParams.skip =
        (paginationParams.page - 1) * paginationParams.perPage;
      while (hasPage) {
        const { data } = await this.findAll(paginationParams, filter);
        if (data.length > 0) {
          rows = [...rows, ...data];
          paginationParams.page += 1;
          paginationParams.skip =
            (paginationParams.page - 1) * paginationParams.perPage;
        } else {
          hasPage = false;
        }
      }
      const book = new Excel.Workbook();
      const sheet = book.addWorksheet('domains');
      sheet.columns = [
        {
          header: 'Auction ID',
          key: 'auctionId',
        },
        { header: 'Name', key: 'name' },
        { header: 'Total BackLink', key: 'totalBackLink' },
        { header: 'Total Matched', key: 'totalMatched' },
        { header: 'Provider', key: 'provider' },
        { header: 'Winning', key: 'winning' },
        { header: 'NumberOfBidders', key: 'numberOfBidders' },
        { header: 'BidIncrement', key: 'bidIncrement' },
        { header: 'Minimum Nex tBid', key: 'minimumNextBid' },
        { header: 'HighBid', key: 'highBid' },
        { header: 'MaxBid', key: 'maxBid' },
        { header: 'Highest Bidder', key: 'highestBidder' },
        { header: 'End Time', key: 'endTime' },
        { header: 'Type', key: 'type' },
        { header: 'Date Updated', key: 'updateDate' },
      ];
      sheet.addRows(rows);
      return book;
    } catch (e) {
      console.log(e);
    }
  }

  remove(id: ObjectId) {
    return this.domainModel.findOneAndDelete({ _id: id });
  }
}
