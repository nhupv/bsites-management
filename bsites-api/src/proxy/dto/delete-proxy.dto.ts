import {IsNotEmpty, IsString} from "class-validator";

export class DeleteProxyDto {
    @IsString()
    @IsNotEmpty()
    proxy_url: string;
}
