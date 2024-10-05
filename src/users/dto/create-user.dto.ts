import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    userName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    firstLastName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    secondLastName: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    phoneNumber: string;

    @IsDate()
    @IsOptional()
    birthday: Date;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    gender: string;
}
