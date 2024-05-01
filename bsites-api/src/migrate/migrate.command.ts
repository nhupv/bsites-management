import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { PaginationParams } from '../common/pagination/dto/papgination-params.dto';
import { DomainService } from '../domain/domain.service';
import {SitesService} from "../sites/sites.service";
@Injectable()
export class MigrateCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly sitesService: SitesService,
    // @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'migrate:site-status',
        description: 'Add status column in site collection',
      },
      this.addStatusSite.bind(this),
      cli,
    );
  }
  async addStatusSite() {
    // const spin = createSpinner();
    try {

      const sites = await this.sitesService.findAllWithoutPagination()

      if(sites.length === 0 ) {
        console.log('No sites in db.');
      }

      const siteUpdated = await this.sitesService.updateMany({ status: true })

      // for (let site of sites) {
      //   try {
      //     const changeStatus = { status: true }
      //     if(site.status !== undefined) {
      //       changeStatus.status = site.status;
      //     }
      //     const siteUpdate = await this.sitesService.changeStatus(site._id, { status: true })
      //   } catch (e) {
      //     console.log(e)
      //   }
      // }
      console.log('Change status for all site successfully!');
    } catch (e) {
      console.log(e);
    }
  }
}
