import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException, Req
} from '@nestjs/common';
import { BotService } from './bot.service';
import {ParseObjectIdPipe} from "../common/pipes/validation.ObjectId.pipe";
import {SitesService} from "../sites/sites.service";
import {SiteIdGuard} from "../common/guard/siteId.guard";
import {Roles} from "../common/decorator/roles.decorator";
import {Role} from "../roles/role.enum";
import {ResetBotDto} from "./dto/reset-bot.dto";

@Roles(Role.Admin, Role.User, Role.SuperUser)
@UseGuards(SiteIdGuard)
@Controller()
export class BotController {
  constructor(private readonly botService: BotService, private readonly  siteService: SitesService) {}

  // @Post()
  // create(@Body() createBotDto: CreateBotDto) {
  //   return this.botService.create(createBotDto);
  // }

  @Get('list')
  async findAll(@Param('siteId', ParseObjectIdPipe) siteId: string, @Req() req) {
    try {
      const { data } = await this.botService.findAll(req.site.ip);
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Post('reset')
  async restBot(@Param('siteId', ParseObjectIdPipe) siteId: string, @Req() req, @Body() resetBotDto: ResetBotDto) {
    try {
      const { data } = await this.botService.resetBot(req.site.ip, resetBotDto);
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Get('stop-all-bot')
  async stopAllBot(@Req() req) {
    try {
      const { data } = await this.botService.stopAllBot(req.site.ip);
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Get('start-all-bot')
  async startAllBot(@Req() req) {
    try {
      const { data } = await this.botService.startAllBot(req.site.ip);
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }

  @Get('update-code')
  async updateCode(@Req() req) {
    try {
      const { data } = await this.botService.updateCode(req.site.ip);
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString());
    }
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.botService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
  //   return this.botService.update(+id, updateBotDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.botService.remove(+id);
  // }
}
