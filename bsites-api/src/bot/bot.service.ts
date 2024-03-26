import {HttpException, Injectable} from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom, Observable} from "rxjs";
import {Bot} from "./entities/bot.entity";
import { AxiosResponse, AxiosError } from 'axios'
import {map, catchError } from 'rxjs/operators';

@Injectable()
export class BotService {
  constructor( private readonly httpService: HttpService) {
  }
  create(createBotDto: CreateBotDto) {
    return 'This action adds a new bot';
  }

  async findAll(ip: string): Promise<Bot[]> {
    const { data } = await firstValueFrom(
        this.httpService.get<Bot[]>(process.env.BOT_ENDPOINT).pipe(
            catchError((e: AxiosError) => {
              throw new HttpException(e.response.data, e.response.status)
            }),
        ),
    );
    return data
  }

  findOne(id: number) {
    return `This action returns a #${id} bot`;
  }

  update(id: number, updateBotDto: UpdateBotDto) {
    return `This action updates a #${id} bot`;
  }

  remove(id: number) {
    return `This action removes a #${id} bot`;
  }
}
