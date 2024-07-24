import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  NotFoundException
} from '@nestjs/common';
import { FbPageService } from './fb-page.service';
import { CreateFbPageDto } from './dto/create-fb-page.dto';
import { UpdateFbPageDto } from './dto/update-fb-page.dto';
import {PaginationInterceptor} from "../common/pagination/interceptor/pagination.interceptor";
import {Roles} from "../common/decorator/roles.decorator";
import {Role} from "../roles/role.enum";
import {ContextParamsInterceptor} from "../common/interceptors/context-params.interceptor";
import {CreateSiteDto} from "../sites/dto/create-site.dto";
import {FilterParams} from "../common/decorator/filter.decorator";
import {Pagination} from "../common/decorator/pagination.decorator";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {ObjectId} from "mongoose";
import {UpdateSiteDto} from "../sites/dto/update-site.dto";
import {FilterFbPageDto} from "./dto/filter-fb-page.dto";

@UseInterceptors(PaginationInterceptor)
@Roles(Role.Admin, Role.SuperUser)
@UseInterceptors(ContextParamsInterceptor)
@Controller('fb-page')
export class FbPageController {
  constructor(private readonly fbPageService: FbPageService) {}

  @HttpCode(201)
  @Post()
  create(@Body() createFbPageDto: CreateFbPageDto) {
    return this.fbPageService.create(createFbPageDto);
  }

  @HttpCode(200)
  @Get('list')
  findAll(@FilterParams() filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams) {
    return this.fbPageService.findAll(pagination, filter);
  }

  @HttpCode(200)
  @Post('all')
  findAllNoPaging(@FilterParams(FilterFbPageDto) filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams) {
    return this.fbPageService.findAllNoPaging(pagination, filter)
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.fbPageService.findOne(id);
  }


  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateFbPageDto: UpdateFbPageDto) {
    const pageUpdate = await this.fbPageService.findOne(id);
    if (!pageUpdate) {
      throw new NotFoundException(`Fb page with id ${id} was not found!`);
    }
    return this.fbPageService.update(id, updateFbPageDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {

    const page = await this.fbPageService.findOne(id);
    if (!page) {
      throw new NotFoundException(`Fb page with id ${id} was not found!`);
    }

    return this.fbPageService.remove(id);
  }
}
