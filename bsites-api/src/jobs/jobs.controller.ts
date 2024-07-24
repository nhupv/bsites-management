import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import {SchedulerRegistry} from "@nestjs/schedule";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {fileFilter} from "../common/helpers/file-helpers";
import {CreatePostFbGroupDto} from "../site-content/dto/create-post-fb-group.dto";
import {CreatePageJobsDto} from "./dto/create-page-jobs.dto";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {JOBS_NAME, JOBS_QUEUE} from "./constants";
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
  async createAddFbPage(@UploadedFile() file: Express.Multer.File, @Body() createPageJobDto: CreatePageJobsDto){
      if(!file) {
          throw new BadRequestException(`Image is required!`);
      }

      await this.jobsService.addPostJobToQueue({...createPageJobDto, imagePath: file.path})

      return 'Add job success!'
  }


  @Post('list')
  @HttpCode(200)
  async getJobList(@Body() filterJobType: FilterPageJobsDto){
    return await this.jobsService.getPostToPageQueueList(filterJobType.types)
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
