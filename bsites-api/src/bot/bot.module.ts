import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import {HttpModule} from "@nestjs/axios";
import {SitesModule} from "../sites/sites.module";

@Module({
  imports: [HttpModule, SitesModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
