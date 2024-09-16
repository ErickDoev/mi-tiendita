import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    productName: string;

    @IsNumber()
    stock: number;

    @IsNumber()
    price: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    variant: string;
    
    @IsString()
    brand: string;

    @IsString()
    category: string;

    @IsArray()
    @IsString({
        each: true
    })
    @IsOptional()
    images: string[];
}
