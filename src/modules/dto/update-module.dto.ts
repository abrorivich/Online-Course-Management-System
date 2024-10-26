import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleDto } from './create-module.dto';
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
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
    courseId: number
}
