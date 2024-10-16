import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Column('varchar', { nullable: true })
    phone_number: string;

    @Column('timestamp')
    last_conection: Date;

    @Column('bool')
    is_active: boolean;

    @Column('date', { nullable: true })
    birthday?: Date;

    @Column('varchar', {
        unique: true
    })
    email: string;

    @Column('varchar')
    password: string;

    @ManyToOne(() => Gender, (gender) => gender.user)
    @JoinColumn({ name: 'gender_id' })
    gender: Gender;

    @ManyToOne(() => Role, (role) => role.user)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToMany(() => Favorite, (fav) => fav.user)
    favorite: Favorite[];

    @OneToMany(() => ShoppingCart, (fav) => fav.user)
    shoppingCart: ShoppingCart[];

    @OneToMany(() => Address, address => address.user)
    address: Address[];

    @OneToMany(() => Order, order => order.user)
    order: Order[];

    @BeforeInsert()
    checkFieldBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.checkFieldBeforeInsert();
    }
    
}
