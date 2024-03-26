import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
export const FilterParams = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.body.winning) {
      request.body.winning = request.body.winning === 'true';
    }
    // Convert headers to DTO object
    const dto = plainToClass(value, request.body, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
    // Validate
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      //Get the errors and push to custom array
      const validationErrors = errors.map((obj) =>
        Object.values(obj.constraints),
      );
      throw new HttpException(
        `Validation failed with following Errors: ${validationErrors}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return Object.keys(dto).map((k) => {
      if (typeof dto[k] === 'number' || typeof dto[k] === 'boolean') {
        return {
          [k]: dto[k],
        };
      }
      if (Array.isArray(dto[k])) {
        return {
          [k]: { $gte: dto[k][0], $lte: dto[k][1] },
        };
      }
      return {
        [k]: { $regex: dto[k], $options: 'i' },
      };
    });
  },
);
