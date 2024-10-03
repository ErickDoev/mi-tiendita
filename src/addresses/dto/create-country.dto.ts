import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCountryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    country_name: string;
}