import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    categoryName: string;
}