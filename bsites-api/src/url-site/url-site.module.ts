import {forwardRef, Module} from '@nestjs/common';
import { UrlSiteService } from './url-site.service';
import { UrlSiteController } from './url-site.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UrlSite, UrlSiteSchema} from "./entities/url-site.entity";
import {SitesModule} from "../sites/sites.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
      HttpModule,
    MongooseModule.forFeatureAsync([
      { name: UrlSite.name, useFactory: ()=> {
          const schema = UrlSiteSchema
          // schema.plugin(require('mongoose-named-scopes'))
          return schema
        } },
    ]),
    forwardRef(() => SitesModule),
  ],
  controllers: [UrlSiteController],
  providers: [UrlSiteService],
  exports: [UrlSiteService]
})
export class UrlSiteModule {}
