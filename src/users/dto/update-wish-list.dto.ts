import { IsNotEmpty, IsString } from "class-validator";

export class UpdateWishListDto {

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    variantId: string;
}