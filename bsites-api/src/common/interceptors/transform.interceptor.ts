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

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => classToPlain(this.transform(data))));
  }

  transform(data) {
    if (data.data && Array.isArray(data.data)) {
      return { ...data, data: data.data.map((d) => d.toObject()) };
    }
    if (Array.isArray(data)) {
      return data.map((d) => d.toObject());
    }
    return data.toObject();
  }
}
