import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./product-variant";

@Entity('variants')
export class Variant {
    @PrimaryGeneratedColumn('uuid')
    variantId: string;

    @Column('varchar')
    variantName: string;

    @OneToMany(() => ProductVariant, (pv) => pv.variant)
    productsVariants: ProductVariant[];
}
