import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    name: string
    
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(128)
    description: string
    
    @IsOptional()
    @IsNumber()
    @Min(500000)
    @Max(2000000)
    price: number

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(64)
    teacher: string
    
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    category: string
    
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(64)
    level: string
}
