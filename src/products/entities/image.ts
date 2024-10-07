import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./product-variant";
import { ProductVariantSize } from "./product-variant-sizes";

@Entity('images')
@Check(`("product_variant_id" IS NOT NULL)`)
export class Image {
    @PrimaryGeneratedColumn('uuid')
    image_id: string;

    @Column('varchar', {
        unique: true
    })
    image_url: string;

    @ManyToOne(() => ProductVariant, (pv) => pv.images, { nullable: true, eager: true, cascade: true })
    @JoinColumn({ name:'product_variant_id' })
    product_variant: ProductVariant;

    @ManyToOne(() => ProductVariantSize, (pv) => pv.images, { nullable: true, eager: true, cascade: true })
    @JoinColumn({ name:'product_variant_size_id' })
    productVariantSize: ProductVariantSize;
}
