import {Allow, IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {JobStatus} from "bull";

export class FilterPageJobsDto {
    @IsArray()
    @IsNotEmpty()
    types: JobStatus[];
}
