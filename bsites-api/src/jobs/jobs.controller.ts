import {Controller, Get, HttpCode} from '@nestjs/common';
import { JobsService } from './jobs.service';
import {Public} from "../common/decorator/public.decorator";
import {SchedulerRegistry} from "@nestjs/schedule";

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService,
              private schedulerRegistry: SchedulerRegistry,
  ) {}


  @Get('cron')
  @HttpCode(200)
  createCron(){
    this.jobsService.createDynamicCron()
    return { msg: 'success'}
  }

  @Get('stop-cron')
  @HttpCode(200)
  stopCron(){
    this.jobsService.stopCronStats()
    return { msg: 'success'}
  }

  @Get('cron-list')
  @HttpCode(200)
  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      console.log(`job: ${key} -> next: ${next}`);
    });
    return { msg: 'success' };
  }
}
