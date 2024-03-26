import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { classToPlain, plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import {Types} from "mongoose";

@Injectable()
export class TransformSiteIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.params.siteId) {
      request.params.obSiteId = Types.ObjectId.createFromHexString(request.params.siteId)
    }
    return next.handle();
  }
}
