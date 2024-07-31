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
  Request,
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
  findAll(@FilterParams() filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams, @Request() req) {
    return this.fbPageService.findAll(pagination, filter, req.user._id);
  }

  @HttpCode(200)
  @Post('all')
  findAllNoPaging(@FilterParams(FilterFbPageDto) filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams, @Request() req) {
    return this.fbPageService.findAllNoPaging(pagination, filter, req.user._id)
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId, @Request() req) {
    return this.fbPageService.findOneByID(id, req.user._id);
  }


  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateFbPageDto: UpdateFbPageDto, @Request() req) {
    const pageUpdate = await this.fbPageService.findOneByID(id, req.user._id);
    if (!pageUpdate) {
      throw new NotFoundException(`Fb page with id ${id} was not found!`);
    }
    return this.fbPageService.update(id, updateFbPageDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId, @Request() req) {

    const page = await this.fbPageService.findOneByID(id, req.user._id);
    if (!page) {
      throw new NotFoundException(`Fb page with id ${id} was not found!`);
    }

    return this.fbPageService.remove(id);
  }
}
