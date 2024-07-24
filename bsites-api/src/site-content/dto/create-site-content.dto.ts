import {Allow, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Types, Schema } from "mongoose"
import {Transform, Type} from "class-transformer";
import {CreatePostFbGroupDto} from "./create-post-fb-group.dto";

export class CreateSiteContentDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    question: string;

    @IsOptional()
    status?: string[];

    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => {
        return Number(value);
    })
    category_id?: number;

    // @IsBoolean()
    // @IsNotEmpty()
    // @Transform(({value} ) => value === 'true')
    // is_post_to_page?: boolean;

    // @IsOptional()
    // page_id?: number;

    @IsOptional()
    caption?: string;

    @IsOptional()
    comment?: string;

    @IsString()
    @IsNotEmpty()
    pages?: string;

    // @IsOptional()
    // schedule_time?: number;

    @IsOptional()
    @IsMongoId({ message: 'site id is not a mongodb id'})
    @Type(()=> Types.ObjectId)
    site?: String | Types.ObjectId;

    @Allow()
    user?: String | Types.ObjectId;
}
