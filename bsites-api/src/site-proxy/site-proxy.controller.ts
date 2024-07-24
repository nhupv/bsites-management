import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post, Req, Request, UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {SiteProxyService} from './site-proxy.service';
import {CreateSiteProxyDto} from './dto/create-site-proxy.dto';
import {UpdateSiteProxyDto} from './dto/update-site-proxy.dto';
import {PaginationInterceptor} from "../common/pagination/interceptor/pagination.interceptor";
import {Roles} from "../common/decorator/roles.decorator";
import {Role} from "../roles/role.enum";
import {ObjectId, Types} from "mongoose";
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {FilterParams} from "../common/decorator/filter.decorator";
import {Pagination} from "../common/decorator/pagination.decorator";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {SiteIdGuard} from "../common/guard/siteId.guard";
import {CreateBulkSiteProxyDto} from "./dto/create-bulk-site-proxy.dto";
import {TransformSiteIdInterceptor} from "../common/interceptors/transform.siteId.interceptor";

@UseInterceptors(PaginationInterceptor)
@UseInterceptors(TransformSiteIdInterceptor)
@Roles(Role.Admin, Role.User, Role.SuperUser)
@Controller()
@UseGuards(SiteIdGuard)
export class SiteProxyController {
  constructor(private readonly siteProxyService: SiteProxyService) {}

  @HttpCode(201)
  @Post()
  async create(@Param('siteId', ParseObjectIdPipe) siteId: String, @Body() createSiteProxyDto: CreateSiteProxyDto) {

    createSiteProxyDto.site = siteId
    return this.siteProxyService.create(createSiteProxyDto);
  }

  @HttpCode(201)
  @Post('create-bulk')
  async createBulk(@Request() req, @Param('siteId', ParseObjectIdPipe) siteId: String, @Body() createBulkSiteProxyDto: CreateBulkSiteProxyDto) {

    const proxyList : CreateSiteProxyDto[] = createBulkSiteProxyDto.proxies.map(proxy => ({
      proxy : proxy,
      site: siteId,
      user: req.user._id
    }))
    return this.siteProxyService.createBulk(proxyList);
  }

  @HttpCode(200)
  @Get('list')
  findAll(@FilterParams() filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams) {
    return this.siteProxyService.findAll(pagination,filter );
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.siteProxyService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateSiteProxyDto: UpdateSiteProxyDto) {
    const proxyUpdate = await this.siteProxyService.findOne(id);

    if (!proxyUpdate) {
      throw new NotFoundException(`Proxy with id ${id} was not found!`);
    }

    return this.siteProxyService.update(id, updateSiteProxyDto);
  }

  @Delete('delete-all')
  async removeAll() {
    return this.siteProxyService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const proxyUpdate = await this.siteProxyService.findOne(id);

    if (!proxyUpdate) {
      throw new NotFoundException(`Proxy with id ${id} was not found!`);
    }
    return this.siteProxyService.remove(id);
  }
}
