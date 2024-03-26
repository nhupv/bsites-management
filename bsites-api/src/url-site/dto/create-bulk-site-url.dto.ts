import {ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUrl, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CreateBulkSiteUrlDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsUrl({},{ each: true })
    urls: string[];
}
