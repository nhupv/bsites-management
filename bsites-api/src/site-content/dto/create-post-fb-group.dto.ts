import {Allow, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Types, Schema } from "mongoose"
import {Type} from "class-transformer";

export class CreatePostFbGroupDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    page_id: number;

    @IsNotEmpty()
    caption: string;

    @IsOptional()
    comment?: string;

    @IsOptional()
    schedule_time?: number;

}
