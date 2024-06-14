import {Allow, ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Types, Schema } from "mongoose"
import {Type} from "class-transformer";
import {CreateSiteContentDto} from "./create-site-content.dto";

export class CreateBulkSiteContentDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    titles: string[];

    @IsString()
    @IsOptional()
    category: string;

    @IsNumber()
    @IsOptional()
    category_id: number
}
