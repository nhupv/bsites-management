import {IsISO8601, IsNotEmpty} from "class-validator";

export class FilterChartDashboardDto {
    @IsNotEmpty()
    @IsISO8601()
    start_date: string;

    @IsNotEmpty()
    @IsISO8601()
    end_date: string;

}
