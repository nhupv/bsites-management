import {ArrayMinSize, IsArray, IsNotEmpty, ValidateNested} from "class-validator";

export class CreateProxyDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    proxies: string[];
}
