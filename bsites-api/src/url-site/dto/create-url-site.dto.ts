import {Allow, IsBoolean, IsMongoId, IsNotEmpty, IsOptional} from "class-validator";
import { Types, Schema } from "mongoose"
import {Type} from "class-transformer";

export class CreateUrlSiteDto {
    @IsNotEmpty()
    url: string;

    @IsBoolean()
    @IsNotEmpty()
    priority: boolean;

    @IsOptional()
    description?: string;

    // @IsNotEmpty()
    @IsOptional()
    @IsMongoId({ message: 'site id is not a mongodb id'})
    @Type(()=> Types.ObjectId)
    site?: String | Types.ObjectId;

    @Allow()
    user?: String | Types.ObjectId;
}
