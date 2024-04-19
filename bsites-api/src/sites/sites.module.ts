import {forwardRef, Module} from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Site, SiteSchema} from "./entities/site.entity";
import {CheckSiteUrlExisted} from "../common/validator/CheckSiteUrlExisted";
import {HttpModule} from "@nestjs/axios";
import {UrlSiteModule} from "../url-site/url-site.module";

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UrlSiteModule),
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
    ]),
  ],
  controllers: [SitesController],
  providers: [SitesService, CheckSiteUrlExisted],
  exports: [SitesService]
})
export class SitesModule {}
