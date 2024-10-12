import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { Category } from "./category.entity";
import { Image } from "./image.entity";
import { ProductVariantSize } from "./product-variant-sizes.entity";
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    product_id: string;

    @Column('varchar', {
        unique: true
    })
    product_name: string;

    @Column('numeric')
    price: number;

    @Column('text')
    description: string;

    @Column('boolean', { default: true })
    is_active: boolean;

    @Column('timestamp', { default: new Date() })
    last_updated: Date;

    @OneToMany(() => ProductVariant, (pv) => pv.product, { cascade: true, eager: true })
    productVariants: ProductVariant[];

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
