import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post, UseGuards,
  Request,
  UseInterceptors, BadRequestException
} from '@nestjs/common';
import {UrlSiteService} from './url-site.service';
import {UpdateUrlSiteDto} from './dto/update-url-site.dto';
import {PaginationInterceptor} from "../common/pagination/interceptor/pagination.interceptor";
import {Roles} from "../common/decorator/roles.decorator";
import {Role} from "../roles/role.enum";
import {ObjectId, Types} from "mongoose";
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {SitesService} from "../sites/sites.service";
import {FilterParams} from "../common/decorator/filter.decorator";
import {FilterDomain} from "../domain/dto/filter-domain.dto";
import {Pagination} from "../common/decorator/pagination.decorator";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {CreateUrlSiteDto} from "./dto/create-url-site.dto";
import {SiteIdGuard} from "../common/guard/siteId.guard";
import {CreateBulkSiteUrlDto} from "./dto/create-bulk-site-url.dto";

@UseInterceptors(PaginationInterceptor)
@Roles(Role.Admin, Role.User, Role.SuperUser)
@Controller()
@UseGuards(SiteIdGuard)
export class UrlSiteController {
  constructor(private readonly urlSiteService: UrlSiteService) {}

  @HttpCode(201)
  @Post()
  async create(@Param('siteId', ParseObjectIdPipe) siteId: string, @Body() createUrlSiteDto: CreateUrlSiteDto) {
    createUrlSiteDto.site = siteId
    return this.urlSiteService.create(createUrlSiteDto);
  }

  @HttpCode(201)
  @Post('create-bulk')
  async createBulk(@Request() req, @Param('siteId', ParseObjectIdPipe) siteId: string, @Body() createBulkSiteUrlDto: CreateBulkSiteUrlDto) {

    const urlList : CreateUrlSiteDto[] = createBulkSiteUrlDto.urls.map(url => ({
      url : url,
      site: siteId,
      user: req.user._id
    }))
    return this.urlSiteService.createBulk(urlList);
  }

  @HttpCode(200)
  @Get('list')
  findAll(@FilterParams(FilterDomain) filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams) {
    return this.urlSiteService.findAll(pagination, filter );
  }

  @HttpCode(200)
  @Get('push')
  async pushData(@Request() req) {
    try {
      const { data } = await this.urlSiteService.pushData(req.site.ip)
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.urlSiteService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateUrlSiteDto: UpdateUrlSiteDto) {
    const urlUpdate = await this.urlSiteService.findOne(id);

    if (!urlUpdate) {
      throw new NotFoundException(`UrlSite with id ${id} was not found!`);
    }

    return this.urlSiteService.update(id, updateUrlSiteDto);
  }

  @Delete('delete-all')
  async removeAll() {
    return this.urlSiteService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const urlUpdate = await this.urlSiteService.findOne(id);

    if (!urlUpdate) {
      throw new NotFoundException(`UrlSite with id ${id} was not found!`);
    }
    return this.urlSiteService.remove(id);
  }

}
