import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ProductVariant } from "./product-variant";

@Entity('images')
@Check(`("product_id" IS NOT NULL AND "product_variant_id" IS NULL) OR ("product_id" IS NULL AND "product_variant_id" IS NOT NULL)`)
export class Image {
    @PrimaryGeneratedColumn('uuid')
    image_id: string;

    @Column('varchar', {
        unique: true
    })
    image_url: string;

    @ManyToOne(() => Product, (product) => product.images, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariant, (pv) => pv.images, { nullable: true })
    @JoinColumn({ name:'product_variant_id' })
    product_variant: ProductVariant;
}
