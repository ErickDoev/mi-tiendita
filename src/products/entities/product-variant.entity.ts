import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Product } from "./product.entity";
import { Variant } from "./variant.entity";
import { ProductVariantSize } from "./product-variant-sizes.entity";

@Entity('product_variants')
@Unique(['product', 'variant'])
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    product_variant_id: string;

    @ManyToOne(() => Product, (product) => product.productVariants)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Variant, (variant) => variant.productVariants)
    @JoinColumn({ name: 'variant_id' })
    variant: Variant;

    @OneToMany(() => ProductVariantSize, pvs => pvs.productVariant)
    productVariantSizes: ProductVariantSize[];

}
