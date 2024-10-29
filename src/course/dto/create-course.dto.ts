import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

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
    @MinLength(4)
    @MaxLength(64)
    teacher: string

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

    @IsOptional()
    @IsNumber()
    userId: number
}
