import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsString, ValidateNested } from "class-validator";
import { CreateProductVariantSizeDto } from "./create-product-variant-size.dto";

export class CreateProductVariantDto {
    @IsString()
    variantId: string;

    @IsArray({ message: 'Los tamaños deben ser un arreglo.' })
    @ArrayMinSize(1, { message: 'Debe incluir al menos un tamaño.' })
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantSizeDto)
    sizes: CreateProductVariantSizeDto[];
}