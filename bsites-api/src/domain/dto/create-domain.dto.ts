import {
  IsNotEmpty,
  IsOptional,
  Validate,
  IsISO8601,
} from 'class-validator';
import { CheckDomainExisted } from '../../common/validator/CheckDomainExisted';

export class CreateDomainDto {
  @IsNotEmpty()
  @Validate(CheckDomainExisted, {
    message: 'Domain with auctionId already exists.',
  })
  auctionId: number;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  endTime?: string;

  @IsOptional()
  winning?: boolean;

  @IsOptional()
  highBid?: number;

  @IsOptional()
  maxBid?: number;

  @IsOptional()
  numberOfBidders?: number;

  @IsOptional()
  highestBidder?: string;

  @IsOptional()
  minimumNextBid?: number;

  @IsOptional()
  bidIncrement?: number;

  @IsOptional()
  type?: string;

  @IsOptional()
  provider?: string;

  @IsOptional()
  detailLink?: string;
}
