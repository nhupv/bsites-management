import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import {DASHBOARD_QUEUE } from './constants';
import {DashboardService} from "./dashboard.service";
import {CreateDashboardDto} from "./dto/create-dashboard.dto";
@Processor(DASHBOARD_QUEUE.INSERT_STATS_QUEUE)
@Injectable()
export class DashboardStatsConsumer {
  private readonly logger = new Logger(DashboardStatsConsumer.name);
  constructor(private readonly dashboardService: DashboardService) {}

  @OnQueueCompleted()
  async onComplete(job: Job<any>, result: any) {
    this.logger.log(
      `Insert stats success, job complete with site ${job.data.site.siteUrl}`,
    );
  }
  @OnQueueFailed()
  async onFailed(job: Job<any>, error) {
    this.logger.error(`Job failed with site ${job.data.site.siteUrl}`);
    this.logger.error(error.message  || error.toString())
  }

  @Process({
    name: DASHBOARD_QUEUE.INSERT_STATS_JOB,
    concurrency: +process.env.JOB_CONCURRENCY,
  })
  async insertStats(job: Job<any>) {
    const { site, time } = job.data
    try {
      const { data } = await this.dashboardService.getStats(site.ip)

      if(site.siteUrl !== data.site_url) {
        this.logger.warn(`Response site url is not equal |Site url response: ${data.site_url} | Site url db: ${site.siteUrl}`);
        data.site_url = site.siteUrl
      }

      const createStatsDto : CreateDashboardDto = {
        ...data,
        time,
      }

      const stats = await this.dashboardService.create(createStatsDto)
      this.logger.log(`Job complete with site_url ${stats.site_url} ctr ${stats.ctr} | total_click_ads ${stats.total_click_ads} | total_views ${stats.total_views}`);

    } catch (e) {
      this.logger.error(`Insert stats to db error in job`);
      throw new Error(e);
    }
  }
}
