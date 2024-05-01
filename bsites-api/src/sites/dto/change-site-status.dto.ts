import {IsBoolean, IsNotEmpty, IsOptional, IsUrl} from "class-validator";
import {Types} from "mongoose";
export class ChangeSiteStatusDto {
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;
}
