import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    name: string

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    description: string

    @IsOptional()
    @IsNumber()
    modulesId: number
}
