import { Controller, Get } from '@nestjs/common';
import { DomainService } from '../domain/domain.service';
// import { TrackingDomainService } from '../tracking-domain/tracking-domain.service';
// import { BacklinkService } from '../backlink/backlink.service';
import moment from 'moment';

@Controller('stats')
export class DashboardController {
  constructor(
    private readonly domainService: DomainService,
    // private readonly trackingDomainService: TrackingDomainService,
    // private readonly backlinkService: BacklinkService,
  ) {}

  @Get('domain')
  totalDomain() {
    return this.domainService.getTotal();
  }

  @Get('tracking-domain')
  totalTrackingDomain() {
    // return this.trackingDomainService.getTotal();
  }

  @Get('domain/today')
  findByToday() {
    const date = moment();
    // return this.backlinkService.findByDate(date);
  }

  @Get('domain/yesterday')
  findByYesterday() {
    const date = moment().subtract(1, 'days');
    // return this.backlinkService.findByDate(date);
  }
  @Get('domain/matched')
  async findByTopMatched() {
    // return this.backlinkService.getTopMatchedDomain();
    return await this.domainService.getTopMatched();
  }
}
