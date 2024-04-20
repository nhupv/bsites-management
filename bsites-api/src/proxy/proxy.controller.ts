import {Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';
import {DeleteProxyDto} from "./dto/delete-proxy.dto";

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  async create(@Body() createProxyDto: CreateProxyDto) {
    try {
      const { data } = await this.proxyService.create(createProxyDto);
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString())
    }
  }

  @Get()
  async findAll() {
    try {
      const { data } = await this.proxyService.findAll();
      return data
    } catch (e) {
      throw new BadRequestException(e.message || e.toString())
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.proxyService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProxyDto: UpdateProxyDto) {
  //   return this.proxyService.update(+id, updateProxyDto);
  // }

  @Delete()
  async remove(@Body() deleteProxyDto: DeleteProxyDto) {
    try {
      return this.proxyService.remove(deleteProxyDto);
    } catch (e) {
      throw new BadRequestException(e.message || e.toString())
    }
  }
}
