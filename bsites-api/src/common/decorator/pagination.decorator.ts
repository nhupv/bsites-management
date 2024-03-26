import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
export const Pagination = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Convert headers to DTO object
    const dto = plainToClass(value, request.query, {
      excludeExtraneousValues: true,
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
    return dto;
  },
);
