import {IsBoolean, IsNotEmpty} from "class-validator";


export class UpdatePostPriorityDto {
    @IsBoolean()
    @IsNotEmpty()
    priority: boolean;
}
