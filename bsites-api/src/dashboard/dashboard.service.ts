import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import {HttpService} from "@nestjs/axios";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Dashboard, DashboardDocument} from "./entities/dashboard.entity";
import {DASHBOARD_QUEUE} from "./constants";
import {Queue} from "bull";
import {InjectQueue} from "@nestjs/bull";
import {Site} from "../sites/entities/site.entity";
import {FilterChartDashboardDto} from "./dto/filter-chart-dashboard.dto";
import moment from "moment";
import {PaginationParams} from "../common/pagination/dto/papgination-params.dto";
import {FilterBotHistoryDto} from "./dto/filter-bot-history.dto";
@Injectable()
export class DashboardService {
  constructor(
      @InjectQueue(DASHBOARD_QUEUE.INSERT_STATS_QUEUE)
      private queue: Queue,
      @InjectModel(Dashboard.name) private  dashboardModel : Model<DashboardDocument>,
      private readonly http: HttpService,

  ) {}

  create(createDashboardDto: CreateDashboardDto) {
    const stats = new this.dashboardModel(createDashboardDto);
    return stats.save();
  }

  getStatsChart(filterChart: FilterChartDashboardDto, siteUrl: string) {
      return this.dashboardModel.find({time: {
              $gte: moment(filterChart.start_date).startOf('day').toDate(),
              $lte: moment(filterChart.end_date).endOf('day').toDate()
          }, site_url: siteUrl})
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

    getBotHistory(ip:string, pagination: PaginationParams, filter: FilterBotHistoryDto) {
      const { page, perPage } = pagination;
        return this.http
            .get(
                `http://${ip}:5000/list_history?page=${page}&page_size=${perPage}&bot_index=${filter.bot_index}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .toPromise();
    }

  resetStats(ip:string) {
    return this.http
        .get(
            `http://${ip}:5000/reset_stats`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }
    async insertStatsJob(site: Site, time: Date) {
        await this.queue.add(DASHBOARD_QUEUE.INSERT_STATS_JOB, { site, time});
    }
}
