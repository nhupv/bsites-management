import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Site, SiteSchema} from "./entities/site.entity";
import {CheckSiteUrlExisted} from "../common/validator/CheckSiteUrlExisted";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
    ]),
  ],
  controllers: [SitesController],
  providers: [SitesService, CheckSiteUrlExisted],
  exports: [SitesService]
})
export class SitesModule {}
