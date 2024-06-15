import {Allow, IsBoolean, IsMongoId, IsNotEmpty, IsOptional} from "class-validator";

export class UpdateUrlPriorityDto {
    @IsBoolean()
    @IsNotEmpty()
    priority: boolean;

}
