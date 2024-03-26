import {ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUrl, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CreateBulkSiteKeywordDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    keywords: string[];
}
