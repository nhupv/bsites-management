import {HttpException, Injectable} from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom, Observable} from "rxjs";
import {Bot} from "./entities/bot.entity";
import { AxiosResponse, AxiosError } from 'axios'
import {map, catchError } from 'rxjs/operators';
import {ResetBotDto} from "./dto/reset-bot.dto";

@Injectable()
export class BotService {
  constructor( private readonly httpService: HttpService) {
  }
  create(createBotDto: CreateBotDto) {
    return 'This action adds a new bot';
  }

  findAll(ip: string) {
    return this.httpService
        .get(
            `http://${ip}:5000/list_processes`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }

  resetBot(ip: string, resetBotDto: ResetBotDto) {
    return this.httpService
        .post(
            `http://${ip}:5000/reset_bot`,
            resetBotDto,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }

    stopAllBot(ip: string) {
        return this.httpService
            .get(
                `http://${ip}:5000/stop_all_bot`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .toPromise();
    }
    startAllBot(ip: string) {
        return this.httpService
            .get(
                `http://${ip}:5000/start_all_bot`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .toPromise();
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
