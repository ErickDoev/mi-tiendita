import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAddressDto {

    @IsString()
    address: string;

    @IsString()
    @IsOptional()
    addressExtra: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    country: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    state: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsNumber()
    @IsNotEmpty()
    cp: string;

    @IsString()
    @IsNotEmpty()
    addressPhone: string;
    
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    user: string;
}
