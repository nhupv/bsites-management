import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class StripContextPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any) {
    if (value.context) {
      // drop context key in the desired way
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { context, ...rest } = value;
      return rest;
    }
    return value;
  }
}
