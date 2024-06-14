import {Allow, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Types, Schema } from "mongoose"
import {Type} from "class-transformer";

export class CreateSiteContentDto {
    @IsNotEmpty()
    question: string;

    @IsOptional()
    status?: string[];

    @IsString()
    content?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsNumber()
    @IsOptional()
    category_id?: number;

    @IsOptional()
    @IsMongoId({ message: 'site id is not a mongodb id'})
    @Type(()=> Types.ObjectId)
    site?: String | Types.ObjectId;

    @Allow()
    user?: String | Types.ObjectId;
}
