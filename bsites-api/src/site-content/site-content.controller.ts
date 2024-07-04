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
  NotFoundException,
  UseInterceptors, UseGuards, BadRequestException, UploadedFile
} from '@nestjs/common';
import { SiteContentService } from './site-content.service';
import { CreateSiteContentDto } from './dto/create-site-content.dto';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {CreateBulkSiteContentDto} from "./dto/create-bulk-site-content.dto";
import {FilterParams} from "../common/decorator/filter.decorator";
import {FilterDomain} from "../domain/dto/filter-domain.dto";
import {Pagination} from "../common/decorator/pagination.decorator";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {ObjectId} from "mongoose";
import {PaginationInterceptor} from "../common/pagination/interceptor/pagination.interceptor";
import {SiteIdGuard} from "../common/guard/siteId.guard";
import {ContentStatus} from "./enum/content-status-enum";
import {SiteParam} from "../common/decorator/site.decorator";
import {Site} from "../sites/entities/site.entity";
import {fileFilter, getParseLinkPrompt, getTitle, getValueTitle} from "../common/helpers/file-helpers";
import {ChangeSiteStatusDto} from "../sites/dto/change-site-status.dto";
import {UpdatePostPriorityDto} from "./dto/update-post-priority.dto";
import {CreatePostFbGroupDto} from "./dto/create-post-fb-group.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";

@UseInterceptors(PaginationInterceptor)
@Controller()
@UseGuards(SiteIdGuard)
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Post()
  async create(@Request() req, @Param('siteId', ParseObjectIdPipe) siteId: string, @Body() createSiteContentDto: CreateSiteContentDto) {
    createSiteContentDto.site = siteId
    const post = await this.siteContentService.create(createSiteContentDto);
    if(getParseLinkPrompt(post.question).length > 0) {
      await this.siteContentService.insertParseLinkJob({post, site: req.site})
    } else {
      await this.siteContentService.insertPostJob({post: post, site: req.site})
    }
    return post
  }

  @HttpCode(201)
  @Post('create-bulk')
  async createBulk(@Request() req, @Param('siteId', ParseObjectIdPipe) siteId: string, @Body() createBulkSiteContentDto: CreateBulkSiteContentDto) {

    const urlList : CreateSiteContentDto[] = createBulkSiteContentDto.titles.map(title => ({
      title : getTitle(title).length > 0 ? getTitle(title)[0] : title,
      question : title,
      // status : [ContentStatus.PROCESSING],
      site: siteId,
      category_id: createBulkSiteContentDto.category_id,
      category: createBulkSiteContentDto.category,
      user: req.user._id
    }))

    const list = await this.siteContentService.createBulk(urlList);

    list.forEach(item => {
      if(getValueTitle(item.question).length > 0) {
        this.siteContentService.insertPostJobLink({post: item, site: req.site}, 30000)
      } else {
        this.siteContentService.insertPostJob({post: item, site: req.site})
      }
    })

    return { message: 'Save posts successfully! Job create post is running.' };
  }


  @HttpCode(200)
  @Get('list')
  findAll(@SiteParam() site: Site, @FilterParams(FilterDomain) filter: Array<any>, @Pagination(PaginationParams) pagination: PaginationParams) {
    return this.siteContentService.findAll(pagination, site, filter );
  }

  @HttpCode(200)
  @Get('push')
  async pushData(@SiteParam() site: Site) {
    try {
      const { data } = await this.siteContentService.pushData(site)
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Get(':id')
  findOne(@SiteParam() site: Site, @Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.siteContentService.findOne(id, site);
  }

  @Post(':id/priority')
  async changePriorityPost(@SiteParam() site: Site, @Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updatePostPriorityDto: UpdatePostPriorityDto) {
    const post = await this.siteContentService.findOne(id, site);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found!`);
    }
    return this.siteContentService.changePriority(id, updatePostPriorityDto);
  }

  @Get(':id/recreate')
  async reCreate(@SiteParam() site: Site, @Param('id', ParseObjectIdPipe) id: ObjectId) {
    const post = await this.siteContentService.findOne(id, site);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found!`);
    }

    await this.siteContentService.sendPostToSiteJob({post, site, direct: true})

    return { message: 'Recreate post job is running.' };

  }


  @Get(':id/rewrite')
  async reWrite(@SiteParam() site: Site, @Param('id', ParseObjectIdPipe) id: ObjectId) {
    const post = await this.siteContentService.findOne(id, site);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found!`);
    }

    if(getParseLinkPrompt(post.question).length > 0) {
      await this.siteContentService.insertParseLinkJob({post, site})
    } else {
      await this.siteContentService.insertPostJob({post, site})
    }

    return { message: 'Rewrite post job is running.' };

  }

  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
        }),
        fileFilter: fileFilter,
        limits: { fileSize: 10485760 },
      }),
  )
  @Post(':id/create-post')
  async sendPostToFbGroup(@UploadedFile() file: Express.Multer.File, @Body() createPostGround: CreatePostFbGroupDto, @SiteParam() site: Site, @Param('id', ParseObjectIdPipe) id: ObjectId) {
    if(!file) {
      throw new BadRequestException(`Image is required!`);
    }

    const post = await this.siteContentService.findOne(id, site);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found!`);
    }

    await this.siteContentService.sendPostToFbGroup({payload: {...createPostGround, imagePath: file.path}, post, site})

    return post

  }

  @Patch(':id')
  async update(@SiteParam() site: Site, @Param('id', ParseObjectIdPipe) id: ObjectId, @Body() siteContentDto: UpdateSiteContentDto) {
    const postUpdate = await this.siteContentService.findOne(id, site);

    if (!postUpdate) {
      throw new NotFoundException(`Post with id ${id} was not found!`);
    }

    const post = await this.siteContentService.update(id, siteContentDto);

    await this.siteContentService.updatePostToSiteJob({post, site, direct: true })

    return { message: 'Save post successfully! Job update post is running.' }
  }

  @Delete('delete-all')
  async removeAll(@SiteParam() site: Site) {
    return await this.siteContentService.removeAll(site)
  }

  @Delete('delete-both')
  async removeBoth(@SiteParam() site: Site) {
    const postList = await this.siteContentService.findBySiteId(site._id)

    postList.forEach(post => {
      this.siteContentService.deletePostToSiteJob({ post, site, direct: true})
    })

    return {message: 'Delete post job is running.'};
  }

  @Delete(':id')
  async remove(@SiteParam() site: Site, @Param('id', ParseObjectIdPipe) id: ObjectId) {
    const post = await this.siteContentService.findOne(id, site);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found!`);
    }
    await this.siteContentService.deletePostToSiteJob({post, site, direct: true })
    return { message: 'Delete post job is running! ' }
  }
}
