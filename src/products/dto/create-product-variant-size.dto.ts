import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductVariantSizeDto {
    @IsString()
    @IsNotEmpty()
    sizeId: string;

    @IsInt({ message: 'El stock debe ser un número entero.' })
    @Min(0, { message: 'El stock no puede ser negativo.' })
    stock: number;


    @IsArray()
    @IsString({
        each: true
    })
    images: string[];
}