import { Module } from '@nestjs/common';
import { FbPageService } from './fb-page.service';
import { FbPageController } from './fb-page.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { FbPage, FbPageSchema } from "./entities/fb-page.entity";

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: FbPage.name, schema: FbPageSchema },
    ]),
  ],
  controllers: [FbPageController],
  providers: [FbPageService],
  exports: [FbPageService],
})
export class FbPageModule {}
