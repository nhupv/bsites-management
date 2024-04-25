import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { Role } from 'src/roles/role.enum';
import commander, {Option} from "commander";
import {SchedulerRegistry} from "@nestjs/schedule";
import {CronJob} from "cron";
import {JobsService} from "../jobs.service";

@Injectable()
export class JobsCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly jobsService: JobsService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'stop:cron-jobs-stats',
        description: 'Stop cron-jobs stats!',
      },
      this.stopConJobsStats.bind(this),
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'start:cron-jobs-stats',
        description: 'Start cron-jobs stats!.',
      },
      this.startCronJobsStats.bind(this),
      //   this.jobsService.createDynamicCron('insertStats', '2'),
      cli,
    );
  }

  stopConJobsStats(options, command: commander.Command) {
    // const spin = createSpinner();
    //   const jobsbefore = this.schedulerRegistry.getCronJobs();
    //   console.log(jobsbefore)
    //  this.jobsService.getCronJobs('testJob');

      // this.schedulerRegistry.deleteCronJob('test-123');
      // const jobs = this.schedulerRegistry.getCronJobs();
      // console.log(jobs)
      // // console.log(job)
      // // job.stop();
      // // console.log(job.lastDate());
      // console.log('Delete cron-jobs stats success!');

  }

  async startCronJobsStats(options, command: commander.Command){
    // const spin = createSpinner();
    this.jobsService.createDynamicCron()
    //   const job = this.schedulerRegistry.getCronJob('insertStats');
    //   job.start();
    //   console.log(job.lastDate());
    //   console.log('Start cron-jobs stats success!');
  }
}
