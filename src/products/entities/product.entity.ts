import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProductVariant } from "./product-variant";
import { Brand } from "./brand";
import { Category } from "./category";
import { Image } from "./image";

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

    @OneToMany(() => ProductVariant, (pv) => pv.product, { cascade: true, eager: true })
    product_variants: ProductVariant[];

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    // @OneToMany(() => Image, (image) => image.product, { cascade: true, eager: true })
    // images: Image[];
}
