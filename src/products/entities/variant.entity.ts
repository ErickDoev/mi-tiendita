import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariantSize } from "./product-variant-sizes";

@Entity('variants')
export class Variant {
    @PrimaryGeneratedColumn('uuid')
    variant_id: string;

    @Column('varchar')
    variant_name: string;

    @OneToMany(() => ProductVariantSize, (pv) => pv.variant, { cascade: true, eager: true })
    productVariantSizes: ProductVariantSize[];
}
