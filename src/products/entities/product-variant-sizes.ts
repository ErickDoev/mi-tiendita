import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Product } from "./product.entity";
import { Variant } from "./variant.entity";
import { Image } from "./image";
import { Favorite, ShoppingCart } from "src/users/entities";
import { OrderProduct } from "src/orders/entities/order_products.entity";
import { Size } from "./size";

@Entity('product_variant_sizes')
@Unique(['product', 'variant'])
export class ProductVariantSize {

    @PrimaryGeneratedColumn('uuid')
    product_variant_size_id: string;

    @Column('int')
    stock: number;

    @ManyToOne(() => Product, (product) => product.productVariantSizes)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Variant, (variant) => variant.productVariantSizes)
    @JoinColumn({ name: 'variant_id' })
    variant: Variant;

    @ManyToOne(() => Size, (size) => size.productVariantSizes)
    @JoinColumn({ name: 'size_id' })
    size: Size;

    @OneToMany(() => Image, (img) => img.productVariantSize)
    images: Image[];

    @OneToMany(() => Favorite, (fav) => fav.productVariantSize)
    favorite: Favorite[];

    @OneToMany(() => ShoppingCart, (fav) => fav.productVariantSize)
    shoppingCart: ShoppingCart[];

    @OneToMany(() => OrderProduct, op => op.productVariantSize)
    orderProducts: OrderProduct[];
}