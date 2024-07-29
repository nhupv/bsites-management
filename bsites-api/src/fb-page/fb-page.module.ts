import { Module } from '@nestjs/common';
import { FbPageService } from './fb-page.service';
import { FbPageController } from './fb-page.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { FbPage, FbPageSchema } from "./entities/fb-page.entity";
import {FbPageCommand} from "./command/fb-page.command";
import {ConsoleModule} from "nestjs-console";

@Module({
  imports:[
    ConsoleModule,
    MongooseModule.forFeature([
      { name: FbPage.name, schema: FbPageSchema },
    ]),
  ],
  controllers: [FbPageController],
  providers: [FbPageService, FbPageCommand],
  exports: [FbPageService],
})
export class FbPageModule {}
