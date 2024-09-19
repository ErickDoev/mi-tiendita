import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Product } from "./product.entity";
import { Variant } from "./variant.entity";
import { Image } from './image';
import { Favorite, ShoppingCart } from "src/users/entities";

@Entity('product_variants')
@Unique(['product', 'variant'])
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    product_variant_id: string;

    @Column('int')
    stock: number;

    @ManyToOne(() => Product, (product) => product.product_variants)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Variant, (variant) => variant.product_variants)
    @JoinColumn({ name: 'variant_id' })
    variant: Variant;

    @OneToMany(() => Image, (img) => img.product_variant)
    images: Image[];

    @OneToMany(() => Favorite, (fav) => fav.productVariant)
    favorite: Favorite[];

    @OneToMany(() => ShoppingCart, (fav) => fav.productVariant)
    shoppingCart: ShoppingCart[];
}
