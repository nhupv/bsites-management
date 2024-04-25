import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DomainModule } from '../domain/domain.module';
import {HttpModule} from "@nestjs/axios";
import {SitesModule} from "../sites/sites.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Dashboard, DashboardSchema} from "./entities/dashboard.entity";
import {BullModule} from "@nestjs/bull";
import {DASHBOARD_QUEUE} from "./constants";
import {DashboardStatsConsumer} from "./dashboard-stats.consumer";

@Module({
  imports: [DomainModule, HttpModule, SitesModule,
    BullModule.registerQueue({
      name: DASHBOARD_QUEUE.INSERT_STATS_QUEUE,
    }),
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
    ])],

  controllers: [DashboardController],
  providers: [DashboardService, DashboardStatsConsumer],
  exports: [DashboardService],
})
export class DashboardModule {}
