import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Image } from "./image.entity";
import { Favorite, ShoppingCart } from "src/users/entities";
import { OrderProduct } from "src/orders/entities/order_products.entity";
import { Size } from "./size.entity";
import { ProductVariant } from "./product-variant.entity";

@Entity('product_variant_sizes')
@Unique(['size'])
export class ProductVariantSize {

    @PrimaryGeneratedColumn('uuid')
    product_variant_size_id: string;

    @Column('int')
    stock: number;

    @ManyToOne(() => ProductVariant, productVariant => productVariant.productVariantSizes)
    productVariant: ProductVariant;

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