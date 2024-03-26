import { Module } from '@nestjs/common';
import { SiteProxyController } from './site-proxy.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SiteProxy, SiteProxySchema} from "./entities/site-proxy.entity";
import {SitesModule} from "../sites/sites.module";
import {SiteProxyService} from "./site-proxy.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteProxy.name, schema: SiteProxySchema },
    ]),
      SitesModule
  ],
  controllers: [SiteProxyController],
  providers: [SiteProxyService],
})
export class SiteProxyModule {}
