import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator"

export class CreateAssignmentDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    description: string

    @IsNotEmpty()
    @IsNumber()
    @Min(12)
    @Max(48)
    deadline: number

    @IsNotEmpty()
    @IsNumber()
    lessonId: number
}
