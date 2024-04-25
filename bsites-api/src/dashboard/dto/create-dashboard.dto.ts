import {IsNotEmpty} from "class-validator";

export class CreateDashboardDto {
    @IsNotEmpty()
    ctr: number;

    @IsNotEmpty()
    total_click_ads: number;

    @IsNotEmpty()
    total_views: number;

    @IsNotEmpty()
    site_url: string

    @IsNotEmpty()
    time: Date
}
