import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariant } from "./product-variant";
import { Brand } from "./brand";
import { Category } from "./category";
import { Image } from "./image";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    productId: string;

    @Column('varchar', {
        unique: true
    })
    productName: string;

    @Column('int', { nullable: true })
    stock?: number;

    @Column('numeric')
    price: number;

    @Column('text')
    description: string;

    @Column('boolean')
    isActive: boolean;

    @Column('timestamp')
    lastUpdated: Date;

    @OneToMany(() => ProductVariant, (pv) => pv.product, { cascade: true, eager: true })
    productsVariants: ProductVariant[];

    @ManyToOne(() => Brand, (brand) => brand.products)
    brand: Brand;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(() => Image, (image) => image.product, { cascade: true, eager: true })
    images: Image[];
}
