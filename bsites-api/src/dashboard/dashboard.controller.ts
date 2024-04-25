import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { DomainService } from '../domain/domain.service';
// import { TrackingDomainService } from '../tracking-domain/tracking-domain.service';
// import { BacklinkService } from '../backlink/backlink.service';
import moment from 'moment';
import {DashboardService} from "./dashboard.service";
import {Roles} from "../common/decorator/roles.decorator";
import {Role} from "../roles/role.enum";
import {SiteIdGuard} from "../common/guard/siteId.guard";
import {SitesService} from "../sites/sites.service";
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {FilterChartDashboardDto} from "./dto/filter-chart-dashboard.dto";
import {Public} from "../common/decorator/public.decorator";
import {PaginationInterceptor} from "../common/pagination/interceptor/pagination.interceptor";
import {Pagination} from "../common/decorator/pagination.decorator";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {FilterExternalResourceDecorator} from "../common/decorator/filter-external-resource.decorator";
import {FilterBotHistoryDto} from "./dto/filter-bot-history.dto";

@Roles(Role.Admin, Role.User, Role.SuperUser)
@Controller()
@UseGuards(SiteIdGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly sitesService: SitesService,
  ) {}

  @Get('stats')
  async get(@Req() req) {
    try {
      const { data } = await this.dashboardService.getStats(req.site.ip)
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @UseInterceptors(PaginationInterceptor)
  @Post('bot-history')
  @HttpCode(200)
  async getBotHistory(
      @FilterExternalResourceDecorator(FilterBotHistoryDto) filter: FilterBotHistoryDto,
      @Pagination(PaginationParams) pagination: PaginationParams,
      @Req() req,
  ) {
    try {
      const { data } = await this.dashboardService.getBotHistory(req.site.ip, pagination, filter)
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Get('reset')
  async resetDashboard(@Req() req) {
    try {
      const { data } = await this.dashboardService.resetStats(req.site.ip)
      return data
    } catch (e) {
      console.log(e)
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @HttpCode(200)
  @Post('stats-chart')
  async getStatsChart(@Req() req, @Body() filterStats: FilterChartDashboardDto) {
    try {
      const data = await this.dashboardService.getStatsChart(filterStats, req.site.siteUrl);
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  // @Get('tracking-domain')
  // totalTrackingDomain() {
  //   // return this.trackingDomainService.getTotal();
  // }
  //
  // @Get('domain/today')
  // findByToday() {
  //   const date = moment();
  //   // return this.backlinkService.findByDate(date);
  // }
  //
  // @Get('domain/yesterday')
  // findByYesterday() {
  //   const date = moment().subtract(1, 'days');
  //   // return this.backlinkService.findByDate(date);
  // }
  // @Get('domain/matched')
  // async findByTopMatched() {
  //   // return this.backlinkService.getTopMatchedDomain();
  //   // return await this.domainService.getTopMatched();
  // }
}
