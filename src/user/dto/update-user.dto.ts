import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, Role } from './create-user.dto';
import { IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    username: string

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    email: string
    
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    password: string

    @IsOptional()
    @IsNumber()
    @Min(18)
    @Max(40)
    age: number

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(64)
    from: string

    @IsOptional()
    @IsEnum(Role)
    role: Role
}
