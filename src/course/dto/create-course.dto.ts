import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { CourseLevel } from "../entities/course.entity";

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
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
    @MinLength(4)
    @MaxLength(32)
    category: string

    @IsNotEmpty()
    @IsEnum(CourseLevel)
    @MinLength(4)
    @MaxLength(64)
    level: CourseLevel

    @IsOptional()
    @IsNumber()
    userId: number
}
