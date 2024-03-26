import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ContextParamsInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.body) {
      request.body.context = {
        params: request.params,
      };
    }
    return next.handle();
  }
}
