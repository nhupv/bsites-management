import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  HttpCode,
  Res,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../roles/role.enum';
import { ObjectId } from 'mongoose';
import { PaginationParams } from '../common/pagination/dto/papgination-params.dto';
import { PaginationInterceptor } from '../common/pagination/interceptor/pagination.interceptor';
import { ParseObjectIdPipe } from '../common/pipes/validation.ObjectId.pipe';
import { FilterDomain } from './dto/filter-domain.dto';
import { Pagination } from '../common/decorator/pagination.decorator';
import { FilterParams } from '../common/decorator/filter.decorator';

// @UseInterceptors(TransformInterceptor)
@UseInterceptors(PaginationInterceptor)
@Roles(Role.Admin, Role.SuperUser)
@Controller('domains')
export class DomainController {
  constructor(
    private readonly domainService: DomainService,
  ) {}

  @Post()
  create(@Body() createDomainDto: CreateDomainDto) {
    return this.domainService.create(createDomainDto);
  }
  @HttpCode(200)
  @Post('list')
  findAll(
    @Req() req,
    @FilterParams(FilterDomain) filter: Array<any>,
    @Pagination(PaginationParams)
    pagination: PaginationParams,
  ) {
    return this.domainService.findAll(pagination, filter);
  }

  @HttpCode(200)
  @Post('download')
  async downloadExcelFile(
    @Req() req: Request,
    @Res() res: Response,
    @FilterParams(FilterDomain) filter: Array<any>,
    @Pagination(PaginationParams)
    pagination: PaginationParams,
  ) {
    try {
      const fileName = 'Domain.csv';
      const workBook = await this.domainService.exportExcelFile(
        pagination,
        filter,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
      await workBook.csv.write(res);
      res.end();
      // const buffer = await workBook.csv.writeBuffer();
      // await this.mailService.sendFileToUser(req.user, buffer);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const domain = await this.domainService.findOne(id);
    if (!domain) {
      throw new NotFoundException();
    }
    return domain;
  }
  @Get(':id/back-link')
  async findBackLinkById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const domain = await this.domainService.findOne(id);
    if (!domain) {
      throw new NotFoundException();
    }
    // const backLinkRe = await this.backLinkService.findById(domain.auctionId);
    // const domainList = backLinkRe.data.map((bl) => bl.domain);
    // const trackingList = await this.trackingDomainService.findByDomains(
    //   domainList,
    // );
    return {
      data: {
        domain,
        // backLink: backLinkRe,
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateDomainDto: UpdateDomainDto,
  ) {
    const domainUpdate = await this.domainService.findOne(id);
    if (!domainUpdate) {
      throw new NotFoundException(`Domain with id ${id} was not found!`);
    }
    return this.domainService.update(id, updateDomainDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    const domain = await this.domainService.findOne(id);
    if (!domain) {
      throw new NotFoundException(`Domain with id ${id} was not found.`);
    }
    return this.domainService.remove(id);
  }
}
