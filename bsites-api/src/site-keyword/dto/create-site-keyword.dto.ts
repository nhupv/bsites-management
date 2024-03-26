import {Allow, IsMongoId, IsNotEmpty, IsOptional} from "class-validator";
import { Types, Schema } from "mongoose"
import {Type} from "class-transformer";

export class CreateSiteKeywordDto {
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    keyword: string;

    @IsOptional()
    @IsMongoId({ message: 'site id is not a mongodb id'})
    @Type(()=> Types.ObjectId)
    site?: String | Types.ObjectId;

    @Allow()
    user?: String | Types.ObjectId;
}
