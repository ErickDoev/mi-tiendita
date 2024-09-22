import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { ProductVariant } from "src/products/entities";

@Entity('order_products')
export class OrderProduct {
    @PrimaryGeneratedColumn('uuid')
    order_product_id: string;

    @ManyToOne(() => Order, order => order.order_products)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column('int')
    quantity: number;

    @Column('decimal')
    total: number;

    @ManyToOne(() => ProductVariant, pv => pv.orderProducts)
    @JoinColumn({ name: 'product_variant_id' })
    productVariant: ProductVariant;
}