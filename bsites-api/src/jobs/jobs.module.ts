import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TelegramBotModule } from '../telegram/telegram.module';
import * as moment from 'moment-timezone';
import {SitesModule} from "../sites/sites.module";
import {DashboardModule} from "../dashboard/dashboard.module";
import {ConsoleModule} from "nestjs-console";

@Module({
  imports: [ConsoleModule, TelegramBotModule, SitesModule, DashboardModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    {
      provide: 'Moment',
      useValue: moment,
    },
  ],
  exports: [JobsService]
})
export class JobsModule {}
