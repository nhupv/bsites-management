import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import {HttpService} from "@nestjs/axios";

@Injectable()
export class DashboardService {
  constructor(
      private readonly http: HttpService,
  ) {}
  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  getStats(ip:string) {
    return this.http
        .get(
            `http://${ip}:5000/site_stats`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
