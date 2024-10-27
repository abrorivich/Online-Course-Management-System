import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
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
}