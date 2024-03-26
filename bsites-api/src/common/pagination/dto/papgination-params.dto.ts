import {
  IsOptional,
  IsNumber,
  Min,
  IsISO8601,
  IsBoolean,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class PaginationParams {
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(2)
  perPage?: number;

  @Expose()
  @IsOptional()
  @Type(() => String)
  sortBy?: string;

  @Expose()
  @IsOptional()
  @Type(() => String)
  sortType?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
}
