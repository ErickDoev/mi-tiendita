import { IsEmail, IsString } from "class-validator";

export class LogInDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    password: string;
}