import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { MigrateCommand } from './migrate.command';
import {SitesModule} from "../sites/sites.module";
import {SiteContentModule} from "../site-content/site-content.module";
import {UrlSiteModule} from "../url-site/url-site.module";
import {FbPageModule} from "../fb-page/fb-page.module";

@Module({
  imports: [ConsoleModule, SitesModule, SiteContentModule, UrlSiteModule, FbPageModule],
  providers: [MigrateCommand],
})
export class MigrateModule {}
