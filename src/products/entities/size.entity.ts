import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductVariantSize } from './product-variant-sizes.entity';

@Entity('sizes')
export class Size {

    @PrimaryGeneratedColumn('uuid')
    size_id: string;

    @Column('varchar', { unique: true })
    size_name: string;


    @OneToMany(() => ProductVariantSize, (pv) => pv.size, { cascade: true, eager: true })
    productVariantSizes: ProductVariantSize[];
}