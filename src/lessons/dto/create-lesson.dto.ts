import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateLessonDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    name: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    description: string

    @IsNotEmpty()
    @IsNumber()
    modulesId: number
}
