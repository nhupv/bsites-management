import {Allow, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Types, Schema } from "mongoose"
import {Type} from "class-transformer";

export class CreatePostFbGroupDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    pages: string;

    @IsNotEmpty()
    caption: string;

    @IsOptional()
    comment?: string;

}
