import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateStateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    stateName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    countryId: string;
}