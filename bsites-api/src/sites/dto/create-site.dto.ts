import {Allow, IsNotEmpty, IsOptional, Validate} from "class-validator";
import {Types} from "mongoose";
import {CheckSiteUrlExisted} from "../../common/validator/CheckSiteUrlExisted";
import {ContextAwareDto} from "./context-aware-site.dto";

export class CreateSiteDto extends ContextAwareDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Validate(CheckSiteUrlExisted)
    siteUrl: string;

    @IsNotEmpty()
    ip: string;

    @IsOptional()
    description?: string;

    @Allow()
    user?: String | Types.ObjectId
}
