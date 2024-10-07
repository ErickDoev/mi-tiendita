import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductVariantSize } from './product-variant-sizes';

@Entity('sizes')
export class Size {

    @PrimaryGeneratedColumn('uuid')
    size_id: string;

    @Column()
    size_name: string;


    @OneToMany(() => ProductVariantSize, (pv) => pv.size, { cascade: true, eager: true })
    productVariantSizes: ProductVariantSize[];
}