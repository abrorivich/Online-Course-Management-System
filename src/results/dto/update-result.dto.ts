import { PartialType } from '@nestjs/mapped-types';
import { CreateResultDto } from './create-result.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateResultDto extends PartialType(CreateResultDto) {
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    homework: string

    @IsNotEmpty()
    @IsNumber()
    assignmentId: number

    @IsNotEmpty()
    @IsNumber()
    userId: number
}
