import { User } from "src/users/entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderProduct } from "./order_products.entity";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    order_id: string;

    @Column('varchar')
    status: string;

    @Column('timestamp')
    created_at: Date;

    @ManyToOne(() => User, user => user.order)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderProduct, op => op.order)
    order_products: OrderProduct[];
}
