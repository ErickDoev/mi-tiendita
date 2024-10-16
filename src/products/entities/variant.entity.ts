import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./product-variant.entity";

@Entity('variants')
export class Variant {
    @PrimaryGeneratedColumn('uuid')
    variant_id: string;

    @Column('varchar')
    variant_name: string;

    @OneToMany(() => ProductVariant, (pv) => pv.variant, { cascade: true, eager: true })
    productVariants: ProductVariant[];
}
