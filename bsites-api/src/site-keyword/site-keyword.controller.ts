import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post, Request, UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {SiteKeywordService} from './site-keyword.service';
import {CreateSiteKeywordDto} from './dto/create-site-keyword.dto';
import {UpdateSiteKeywordDto} from './dto/update-site-keyword.dto';
import {PaginationInterceptor} from "../common/pagination/interceptor/pagination.interceptor";
import {Roles} from "../common/decorator/roles.decorator";
import {Role} from "../roles/role.enum";
import {ObjectId, Types} from "mongoose";
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {FilterParams} from "../common/decorator/filter.decorator";
import {Pagination} from "../common/decorator/pagination.decorator";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {SiteIdGuard} from "../common/guard/siteId.guard";
import {CreateBulkSiteKeywordDto} from "./dto/create-bulk-site-keyword.dto";
import {TransformSiteIdInterceptor} from "../common/interceptors/transform.siteId.interceptor";

@UseInterceptors(PaginationInterceptor)
@UseInterceptors(TransformSiteIdInterceptor)
@Roles(Role.Admin, Role.User, Role.SuperUser)
@Controller()
@UseGuards(SiteIdGuard)
export class SiteKeywordController {
  constructor(private readonly siteKeywordService: SiteKeywordService) {}

  @HttpCode(201)
  @Post()
  async create(@Param('siteId', ParseObjectIdPipe) siteId: string, @Body() createSiteKeywordDto: CreateSiteKeywordDto) {

    createSiteKeywordDto.site = siteId
    return this.siteKeywordService.create(createSiteKeywordDto);
  }

  @HttpCode(201)
  @Post('create-bulk')
  async createBulk(@Request() req, @Param('siteId', ParseObjectIdPipe) siteId: string, @Body() createBulkSiteKeywordDto: CreateBulkSiteKeywordDto) {

    const keywordList : CreateSiteKeywordDto[] = createBulkSiteKeywordDto.keywords.map(keyword => ({
      keyword,
      site: siteId,
      user: req.user._id
    }))
    return this.siteKeywordService.createBulk(keywordList);
  }

  @HttpCode(200)
  @Get('list')
  findAll(@FilterParams() filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams) {
    return this.siteKeywordService.findAll(pagination,filter );
  }

  @HttpCode(200)
  @Get('push')
  async pushData(@Request() req) {
    try {
      const { data } = await this.siteKeywordService.pushData(req.site.ip)
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.siteKeywordService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateSiteKeywordDto: UpdateSiteKeywordDto) {
    const keywordUpdate = await this.siteKeywordService.findOne(id);

    if (!keywordUpdate) {
      throw new NotFoundException(`Keyword with id ${id} was not found!`);
    }

    return this.siteKeywordService.update(id, updateSiteKeywordDto);
  }

  @Delete('delete-all')
  async removeAll() {
    return this.siteKeywordService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const keywordDelete = await this.siteKeywordService.findOne(id);

    if (!keywordDelete) {
      throw new NotFoundException(`Keyword with id ${id} was not found!`);
    }
    return this.siteKeywordService.remove(id);
  }
}
