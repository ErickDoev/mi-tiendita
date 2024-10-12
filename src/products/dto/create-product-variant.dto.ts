import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateProductVariantDto {
    @IsNumber()
    stock: number;

    @IsString()
    product: string;

    @IsString()
    variant: string;

    @IsString()
    size: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];
}