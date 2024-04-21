import {BadRequestException, Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
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
