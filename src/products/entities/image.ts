import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ProductVariant } from "./product-variant";

@Entity('images')
@Check(`("productProductId" IS NOT NULL AND "productVariantProductsVariantsId" IS NULL) OR ("productProductId" IS NULL AND "productVariantProductsVariantsId" IS NOT NULL)`)
export class Image {
    @PrimaryGeneratedColumn('uuid')
    imageId: string;

    @Column('varchar', {
        unique: true
    })
    imageUrl: string;

    @ManyToOne(() => Product, (product) => product.images, { nullable: true })
    product: Product;

    @ManyToOne(() => ProductVariant, (pv) => pv.images, { nullable: true })
    productVariant: ProductVariant;
}
