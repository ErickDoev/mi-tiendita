import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    brand_id: string;

    @Column('varchar', {
        unique: true,
    })
    brand_name: string;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];
}
