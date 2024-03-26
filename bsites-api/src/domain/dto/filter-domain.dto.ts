import {
  IsOptional,
  IsNumber,
  IsISO8601,
  IsBoolean,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

@Expose()
export class FilterDomain {
  @Expose()
  @IsOptional()
  @Type(() => String)
  name?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  auctionId?: number;

  @Expose()
  @IsOptional()
  @Type(() => String)
  type?: string;

  @Expose()
  @IsOptional()
  @IsISO8601({ strict: true }, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @Type(() => String)
  endTime?: string[];

  @Expose()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @Type(() => Number)
  numberOfBidders?: number[];

  @Expose()
  @IsOptional()
  @Type(() => String)
  highestBidder?: string;

  @Expose()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @Type(() => Number)
  bidIncrement?: number[];

  @Expose()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @Type(() => Number)
  minimumNextBid?: number[];

  @Expose()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @Type(() => Number)
  maxBid?: number[];

  @Expose()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @Type(() => Number)
  highBid?: number[];

  @Expose()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  winning?: boolean;
}
