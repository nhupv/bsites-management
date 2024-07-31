import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Post, Request,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import {SchedulerRegistry} from "@nestjs/schedule";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {fileFilter, parseJsonFromString} from "../common/helpers/file-helpers";
import {CreatePageJobsDto} from "./dto/create-page-jobs.dto";
import {FilterPageJobsDto} from "./dto/filter-page-jobs.dto";

@Controller('jobs')
export class JobsController {
  constructor(
      private readonly jobsService: JobsService,
  ) {}

  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
        }),
        fileFilter: fileFilter,
        limits: { fileSize: 10485760 },
      }),
  )
  @Post('fb-pages')
  @HttpCode(200)
  async createAddFbPage(@UploadedFile() file: Express.Multer.File, @Body() createPageJobDto: CreatePageJobsDto, @Request() req){
      if(!file) {
          throw new BadRequestException(`Image is required!`);
      }

      const pages: Array<any> = parseJsonFromString(createPageJobDto.pages)
      if(pages.length === 0) {
          throw new BadRequestException('Page is empty!')
      }

      pages.forEach((item:any) => {
          this.jobsService.addPostJobToQueue({...createPageJobDto, imagePath: file.path, ...item, user: req.user._id})
      })

      // await this.jobsService.addPostJobToQueue({...createPageJobDto, imagePath: file.path})

      return 'Add job success!'
  }

  @Post('list')
  @HttpCode(200)
  async getJobList(@Body() filterJobType: FilterPageJobsDto, @Request() req){
    const jobList = await this.jobsService.getPostToPageQueueList(filterJobType.types)
      return jobList.filter((item, index) => {
          return item.data.payload.user === req.user._id.toString();
      })
  }
  //
  // @Get('stop-cron')
  // @HttpCode(200)
  // stopCron(){
  //   this.jobsService.stopCronStats()
  //   return { msg: 'success'}
  // }
  //
  // @Get('cron-list')
  // @HttpCode(200)
  // getCrons() {
  //   const jobs = this.schedulerRegistry.getCronJobs();
  //   jobs.forEach((value, key, map) => {
  //     let next;
  //     try {
  //       next = value.nextDate();
  //     } catch (e) {
  //       next = 'error: next fire date is in the past!';
  //     }
  //     console.log(`job: ${key} -> next: ${next}`);
  //   });
  //   return { msg: 'success' };
  // }
}
