import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateCartDto {

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    variantId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}