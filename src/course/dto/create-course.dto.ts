import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    @MinLength(4)
    name: string

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(128)
    description: string

    @IsNotEmpty()
    @IsNumber()
    @Min(500000)
    @Max(2000000)
    price: number

    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    @MinLength(4)
    category: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    @MinLength(4)
    level: string
}
