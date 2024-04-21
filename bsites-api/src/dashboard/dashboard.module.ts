import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DomainModule } from '../domain/domain.module';
import {HttpModule} from "@nestjs/axios";
import {SitesModule} from "../sites/sites.module";

@Module({
  imports: [DomainModule, HttpModule, SitesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
