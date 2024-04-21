import {IsNotEmpty, IsNumber} from "class-validator";

export class ResetBotDto {
    @IsNumber()
    @IsNotEmpty()
    bot_index: number
}
