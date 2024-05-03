import {ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";

export class CreateProxyDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    proxies: string[];

    @IsString()
    @IsOptional()
    supplier: string;
}
