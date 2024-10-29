import { PartialType } from '@nestjs/mapped-types';
import { CreateResultDto } from './create-result.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Status } from '../entities/result.entity';

export class UpdateResultDto extends PartialType(CreateResultDto) {
    @IsOptional()
    @IsEnum(Status)
    status: Status.Bajarilgan 

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    teacherMessage: string

    @IsNotEmpty()
    @IsNumber()
    ball: number
}
