import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./product-variant";
import { ProductVariantSize } from "./product-variant-sizes";

@Entity('variants')
export class Variant {
    @PrimaryGeneratedColumn('uuid')
    variant_id: string;

    @Column('varchar')
    variant_name: string;

    @OneToMany(() => ProductVariant, (pv) => pv.variant, { cascade: true, eager: true })
    product_variants: ProductVariant[];

    @OneToMany(() => ProductVariantSize, (pv) => pv.variant, { cascade: true, eager: true })
    productVariantSizes: ProductVariantSize[];
}
