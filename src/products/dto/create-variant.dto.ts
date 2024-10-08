import { IsNotEmpty, IsString } from "class-validator";

export class CreateVariantDto {

    @IsString()
    @IsNotEmpty()
    variantName: string;
}
