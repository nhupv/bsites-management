import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { MigrateCommand } from './migrate.command';
import { DomainModule } from '../domain/domain.module';
import {SitesModule} from "../sites/sites.module";
import {SiteContentModule} from "../site-content/site-content.module";
import {UrlSiteModule} from "../url-site/url-site.module";

@Module({
  imports: [ConsoleModule, SitesModule, SiteContentModule, UrlSiteModule],
  providers: [MigrateCommand],
})
export class MigrateModule {}
