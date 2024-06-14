import {Allow, IsNotEmpty, IsNumber, IsOptional, IsString, Validate} from "class-validator";
import {Types} from "mongoose";
import {CheckSiteUrlExisted} from "../../common/validator/CheckSiteUrlExisted";
import {ContextAwareDto} from "./context-aware-site.dto";
import {Transform} from "class-transformer";

export class CreateSiteDto extends ContextAwareDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Validate(CheckSiteUrlExisted)
    siteUrl: string;

    @IsNotEmpty()
    ip: string;

    @IsNumber()
    @Transform(({ value }) => {
        return Number(value);
    })
    @IsOptional()
    ctr?: number;

    @IsNotEmpty()
    status: boolean;

    @IsString()
    username?: boolean;

    @IsString()
    password?: boolean;

    @IsOptional()
    description?: string;

    @Allow()
    user?: String | Types.ObjectId
}
