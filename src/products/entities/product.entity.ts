import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "./brand";
import { Category } from "./category";
import { Image } from "./image";
import { ProductVariantSize } from "./product-variant-sizes";

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

    @Column('boolean')
    is_active: boolean;

    @Column('timestamp')
    last_updated: Date;

    // @OneToMany(() => ProductVariant, (pv) => pv.product, { cascade: true, eager: true })
    // product_variants: ProductVariant[];

    @OneToMany(() => ProductVariantSize, (pv) => pv.product, { cascade: true, eager: true })
    productVariantSizes: ProductVariantSize[];

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
