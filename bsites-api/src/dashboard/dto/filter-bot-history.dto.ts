import {IsISO8601, IsNotEmpty, IsOptional} from "class-validator";
import {Expose, Type} from "class-transformer";

export class FilterBotHistoryDto {
    @Expose()
    @IsNotEmpty()
    @Type(() => Number)
    bot_index?: number;
}
