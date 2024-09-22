import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gender, Role, ShoppingCart } from ".";
import { Favorite } from "./favorites.entity";
import { Address } from "src/addresses/entities";
import { Order } from "src/orders/entities/order.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column('varchar')
    user_name: string;

    @Column('varchar')
    first_last_name: string;

    @Column('varchar')
    second_last_name: string;

    @Column('varchar')
    phone_number: string;

    @Column('timestamp')
    last_conection: Date;

    @Column('bool')
    is_active: boolean;

    @Column('date')
    birthday: Date;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @ManyToOne(() => Gender, (gender) => gender.user)
    @JoinColumn({ name: 'gender_id' })
    gender: string;

    @ManyToOne(() => Role, (role) => role.user)
    @JoinColumn({ name: 'role_id' })
    role: string;

    @OneToMany(() => Favorite, (fav) => fav.user)
    favorite: Favorite[];

    @OneToMany(() => ShoppingCart, (fav) => fav.user)
    shoppingCart: ShoppingCart[];

    @OneToMany(() => Address, address => address.user)
    address: Address[];

    @OneToMany(() => Order, order => order.user)
    order: Order[];
    
}
