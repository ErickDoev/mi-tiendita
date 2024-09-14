import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    category_id: string;

    @Column('varchar')
    category_name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
