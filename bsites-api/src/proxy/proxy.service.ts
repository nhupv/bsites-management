import { Injectable } from '@nestjs/common';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';
import {HttpService} from "@nestjs/axios";
import {DeleteProxyDto} from "./dto/delete-proxy.dto";

@Injectable()
export class ProxyService {
  constructor(
      private readonly http: HttpService,
  ) {}
  create(createProxyDto: CreateProxyDto) {
    return this.http
        .post(
            `http://${process.env.PROXY_HOST}:5000/proxy`,
            createProxyDto,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }

  findAll() {
    return this.http
        .get(
            `http://${process.env.PROXY_HOST}:5000/proxy_list`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
        )
        .toPromise();
  }

  remove(deleteProxyDto: DeleteProxyDto) {
      return this.http
          .delete(
              `http://${process.env.PROXY_HOST}:5000/delete_proxy`,
              {
                  data: deleteProxyDto,
                  headers: {
                      'Content-Type': 'application/json',
                  },
              },
          )
          .toPromise();
  }
}
