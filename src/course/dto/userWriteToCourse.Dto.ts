import { IsNumber, IsOptional } from "class-validator";

export class userWriteToCourseDto {
    @IsOptional()
    @IsNumber()
    userId: number
}
