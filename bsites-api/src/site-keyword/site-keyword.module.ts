import { Module } from '@nestjs/common';
import { SiteKeywordController } from './site-keyword.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SitesModule} from "../sites/sites.module";
import {SiteKeywordService} from "./site-keyword.service";
import {SiteKeyword, SiteKeywordSchema} from "./entities/site-keyword.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
      HttpModule,
    MongooseModule.forFeature([
      { name: SiteKeyword.name, schema: SiteKeywordSchema },
    ]),
      SitesModule
  ],
  controllers: [SiteKeywordController],
  providers: [SiteKeywordService],
})
export class SiteKeywordModule {}
