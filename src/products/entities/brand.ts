import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    brandId: string;

    @Column('varchar', {
        unique: true,
    })
    brandName: string;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];
}
