import {Allow, IsMongoId, IsNotEmpty, IsOptional} from "class-validator";
import { Types, Schema } from "mongoose"
import {Type} from "class-transformer";

export class CreateSiteProxyDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty()
    proxy?: string;

    @IsOptional()
    @IsMongoId({ message: 'site id is not a mongodb id'})
    @Type(()=> Types.ObjectId)
    site?: String | Types.ObjectId;

    @Allow()
    user: String | Types.ObjectId;
}
