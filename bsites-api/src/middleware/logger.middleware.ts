import {BadRequestException, Injectable, NestMiddleware, NotFoundException} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {SitesService} from "../sites/sites.service";
import {Types} from "mongoose";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    // console.log('Request...');
    const validObjectId = Types.ObjectId.isValid(req.params.siteId);
    if(!validObjectId) {
      throw new NotFoundException(`Invalid site id!`);
    }
    next();
  }
}
