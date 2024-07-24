import {IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Validate} from "class-validator";
import {CheckSiteUrlExisted} from "../../common/validator/CheckSiteUrlExisted";
import {Expose, Transform} from "class-transformer";

export class FilterFbPageDto {

    @Expose()
    @IsString()
    @IsOptional()
    page_name?: string;

}
