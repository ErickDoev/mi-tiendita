import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    categoryId: string;

    @Column('varchar')
    category: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
