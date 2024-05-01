import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Request,
  UseInterceptors,
  NotFoundException, ValidationPipe, UsePipes, BadRequestException
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import {Pagination} from "../common/decorator/pagination.decorator";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {FilterParams} from "../common/decorator/filter.decorator";
import {FilterDomain} from "../domain/dto/filter-domain.dto";
import {PaginationInterceptor} from "../common/pagination/interceptor/pagination.interceptor";
import {Roles} from "../common/decorator/roles.decorator";
import {Role} from "../roles/role.enum";
import {ObjectId} from "mongoose";
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {FindByUrlDto} from "./dto/find-by-url.dto";
import {ContextParamsInterceptor} from "../common/interceptors/context-params.interceptor";
import {StripContextPipe} from "../common/pipes/strip.context.pipe";
import { HttpService } from '@nestjs/axios';
import {UrlSite} from "../url-site/entities/url-site.entity";
import {UrlSiteService} from "../url-site/url-site.service";
import {ChangeSiteStatusDto} from "./dto/change-site-status.dto";

@UseInterceptors(PaginationInterceptor)
@Roles(Role.Admin, Role.SuperUser)
@Controller('sites')
@UseInterceptors(ContextParamsInterceptor)
export class SitesController {
  constructor(private readonly sitesService: SitesService,
              private readonly http: HttpService,
              private readonly urlSiteService: UrlSiteService// private readonly sessionService: SessionService,
  ) {}

  @HttpCode(201)
  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @HttpCode(200)
  @Get('list')
  findAll(@FilterParams(FilterDomain) filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams) {
    return this.sitesService.findAll(pagination, filter);
  }

  @Post('/items')
  findOneByUrl(@Body() findByUrl: FindByUrlDto) {
    return this.sitesService.findByUrl(findByUrl.url);
  }

  @Post(':id/status')
  changeSiteStatus(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() changeStatusDto: ChangeSiteStatusDto) {
    return this.sitesService.changeStatus(id, changeStatusDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.sitesService.findOne(id);
  }

  @Get(':id/push')
  async pushData(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const site = await this.sitesService.findOne(id);

    if(!site) {
      throw new NotFoundException(`Site with id ${id} was not found!`);
    }

    const urls = await this.urlSiteService.findBySiteId(site._id)

    try {
      const { data } = await this.http
          .post(
              `http://${site.ip}:5000/push_data`,
              {
                ctr: site.ctr,
                site_url: site.siteUrl,
                list_url: urls.map(url => url.url)
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
          )
          .toPromise();
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString())
    }

  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateSiteDto: UpdateSiteDto) {
    const siteUpdate = await this.sitesService.findOne(id);
    if (!siteUpdate) {
      throw new NotFoundException(`Site with id ${id} was not found!`);
    }
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {

    const siteUpdate = await this.sitesService.findOne(id);
    if (!siteUpdate) {
      throw new NotFoundException(`Site with id ${id} was not found!`);
    }

    return this.sitesService.remove(id);
  }
}
