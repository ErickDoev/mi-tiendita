import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ProductVariantSize } from "src/products/entities";

@Entity('shopping_carts')
export class ShoppingCart {

    @PrimaryGeneratedColumn('uuid')
    shopping_cart_id: string;

    @ManyToOne(() => User, (user) => user.shoppingCart)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => ProductVariantSize, (pv) => pv.shoppingCart)
    @JoinColumn({ name: 'product_variant_size_id' })
    productVariantSize: ProductVariantSize;

    @Column('int', { nullable: false })
    quantity: number;
}