import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './create-assignment.dto';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {
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
    @Min(12)
    @Max(48)
    deadline: number

    @IsOptional()
    @IsNumber()
    lessonId: number
}
