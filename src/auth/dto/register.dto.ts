import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Role } from 'src/user/dto/create-user.dto';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    @MinLength(4)
    username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    email: string
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    password: string

    @IsNotEmpty()
    @IsNumber()
    @Min(18)
    @Max(40)
    age: number

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(64)
    from: string

    @IsOptional()
    @IsEnum(Role)
    role: Role
}
