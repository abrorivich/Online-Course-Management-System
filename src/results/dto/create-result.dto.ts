import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateResultDto {
    @IsNotEmpty()
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
