import {IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Validate} from "class-validator";
import {CheckSiteUrlExisted} from "../../common/validator/CheckSiteUrlExisted";
import {Transform} from "class-transformer";

export class CreateFbPageDto {

    @IsString()
    @IsNotEmpty()
    via_name: string;

    @IsString()
    @IsNotEmpty()
    page_name: string;

    @IsNotEmpty()
    @IsString()
    page_id: string;

    @IsString()
    @IsNotEmpty()
    access_token: string;

    @IsNotEmpty()
    @IsString()
    url?: boolean;

    @IsISO8601()
    @IsString()
    expired_date: Date;

}
