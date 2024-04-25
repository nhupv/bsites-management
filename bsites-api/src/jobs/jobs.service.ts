import { Inject, Injectable, Logger } from '@nestjs/common';
import {Cron, SchedulerRegistry} from '@nestjs/schedule';
import { TelegramBotService } from '../telegram/telegram.service';
import moment from 'moment-timezone';
import {SitesService} from "../sites/sites.service";
import {DashboardService} from "../dashboard/dashboard.service";
import {CronJob} from "cron";
import { Console, Command } from 'nestjs-console';

@Console()
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    // private readonly telegramService: TelegramBotService,
    private readonly siteService: SitesService,
    private readonly dashboardService: DashboardService,
    // @Inject('Moment') private momentService: moment.Moment,
    private schedulerRegistry: SchedulerRegistry,

) {}

  @Command({
    command: 'add:cron-stats',
    description: 'Run Stats Job'
  })
  async createDynamicCron (): Promise<void> {
      const job = new CronJob(`* * * * *`, () => {
        this.logger.warn(`Create for cron job stats to run!`);
        this.handleCron()
      });

      this.schedulerRegistry.addCronJob('insertStats', job);
      job.start();
      this.logger.warn(
          `Cron job insertStats added for each minute!`,
      );
  }

  @Command({
    command: 'stop:cron-stats',
    description: 'Stop Stats Job'
  })
  stopCronStats () {
    const job = this.schedulerRegistry.getCronJob('insertStats');
    job.stop()
    this.logger.log(`Stop insertStats cron job success`)
  }

  @Command({
    command: 'start:cron-stats',
    description: 'Restart Stats Job'
  })
  reStartCronStats () {
    const job = this.schedulerRegistry.getCronJob('insertStats');
    job.start()
    this.logger.log(`Start insertStats cron job success`)
  }

  // @Cron('*/10 * * * *', {
  //   name: 'insertStats',
  //   timeZone: process.env.TZ,
  // })
  async handleCron() {
    this.logger.log('Cron job run every 10 minute', new Date());

    const sites = await this.siteService.findAllWithoutPagination()

    if(sites.length === 0){
      this.logger.error('No sites in db.');
      return
    }

    sites.forEach(site => {
      this.dashboardService.insertStatsJob(site, new Date())
    })
  }
}
