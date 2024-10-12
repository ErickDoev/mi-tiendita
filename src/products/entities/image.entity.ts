import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariantSize } from "./product-variant-sizes.entity";

@Entity('images')
@Check(`("product_variant_size_id" IS NOT NULL)`)
export class Image {
    @PrimaryGeneratedColumn('uuid')
    image_id: string;

    @Column('varchar', {
        unique: true
    })
    image_url: string;

    @ManyToOne(() => ProductVariantSize, (pv) => pv.images, { nullable: true, eager: true, cascade: true })
    @JoinColumn({ name:'product_variant_size_id' })
    productVariantSize: ProductVariantSize;
}
