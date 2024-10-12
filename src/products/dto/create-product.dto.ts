import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateProductVariantDto } from "./create-product-variant.dto";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsOptional()
    description?: string;

    
    @IsString()
    brandId: string;

    @IsString()
    categoryId: string;

    @IsArray({ message: 'Los tamaños deben ser un arreglo.' })
    @ArrayMinSize(1, { message: 'Debe incluir al menos un tamaño.' })
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    variants: CreateProductVariantDto[];
}
