import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { PaginationParams } from '../common/pagination/dto/papgination-params.dto';
import { DomainService } from '../domain/domain.service';
import {SitesService} from "../sites/sites.service";
import {SiteContentService} from "../site-content/site-content.service";
import {UrlSiteService} from "../url-site/url-site.service";
@Injectable()
export class MigrateCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly sitesService: SitesService,
    private readonly postService: SiteContentService,
    private readonly urlService: UrlSiteService,
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

    this.consoleService.createCommand(
        {
          command: 'migrate:post-priority',
          description: 'Add priority column in post collection',
        },
        this.addPostPriority.bind(this),
        cli,
    );

    this.consoleService.createCommand(
        {
          command: 'migrate:url-priority',
          description: 'Add priority column in url collection',
        },
        this.addUrlPriority.bind(this),
        cli,
    );
  }
  async addStatusSite() {
    // const spin = createSpinner();
    try {

      const sites = await this.sitesService.findAllWithoutPagination()

      if(sites.length === 0 ) {
        console.log('No sites is active.');
        return
      }

      const siteUpdated = await this.sitesService.updateMany({ status: true })

      console.log('Change status for all site successfully!');
    } catch (e) {
      console.log(e);
    }
  }
  async addPostPriority() {
    // const spin = createSpinner();
    try {

      const posts = await this.postService.findAllWithoutPagination()

      if(posts.length === 0 ) {
        console.log('No post in db.');
        return
      }

      const postListUpdated = await this.postService.updateMany({ priority: true })

      console.log('Change priority for all post successfully!');
    } catch (e) {
      console.log(e);
    }
  }
  async addUrlPriority() {
    // const spin = createSpinner();
    try {

      const urls = await this.urlService.findAllWithoutPagination()

      if(urls.length === 0 ) {
        console.log('No url in db.');
        return
      }

      const postListUpdated = await this.urlService.updateMany({ priority: true })

      console.log('Change priority for all url successfully!');
    } catch (e) {
      console.log(e);
    }
  }
}
