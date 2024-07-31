import {Allow, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Validate} from "class-validator";
import {CheckSiteUrlExisted} from "../../common/validator/CheckSiteUrlExisted";
import {Transform} from "class-transformer";
import {ContextAwareDto} from "../../sites/dto/context-aware-site.dto";
import {Types} from "mongoose";

export class CreateFbPageDto extends ContextAwareDto{

    @IsString()
    @IsNotEmpty()
    via_name?: string;

    @IsString()
    @IsNotEmpty()
    page_name?: string;

    @IsNotEmpty()
    @IsString()
    page_id?: string;

    @IsString()
    @IsNotEmpty()
    access_token?: string;

    @IsNotEmpty()
    @IsString()
    url?: boolean;

    // @IsISO8601()
    @IsNotEmpty()
    expired_date?: number;

    @Allow()
    user?: String | Types.ObjectId

}
