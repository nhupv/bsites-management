import {Allow, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreatePageJobsDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    caption_prompt: string;

    @IsString()
    @IsNotEmpty()
    pages: string;
}
