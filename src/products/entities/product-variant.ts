import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Product } from "./product.entity";
import { Variant } from "./variant.entity";
import { Image } from './image';

@Entity('products_variants')
@Unique(['product', 'variant'])
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    productsVariantsId: string;

    @Column('int')
    stock: number;

    @ManyToOne(() => Product, (product) => product.productsVariants)
    product: Product;

    @ManyToOne(() => Variant, (variant) => variant.productsVariants)
    variant: Variant;

    @OneToMany(() => Image, (img) => img.productVariant)
    images: Image[];
}
