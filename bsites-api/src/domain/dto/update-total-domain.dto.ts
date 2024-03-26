import { IsOptional } from 'class-validator';
import { Moment } from 'moment-timezone';

export class UpdateTotalDomainDto {
  @IsOptional()
  totalBackLink?: number;

  @IsOptional()
  totalMatched?: number;

  @IsOptional()
  crawledAt?: Moment;
}
