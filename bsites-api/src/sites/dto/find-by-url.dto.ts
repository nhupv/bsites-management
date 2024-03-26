import {IsNotEmpty, IsOptional, IsUrl} from "class-validator";
import {Types} from "mongoose";
export class FindByUrlDto {
    @IsNotEmpty()
    @IsUrl()
    url: string;
}
