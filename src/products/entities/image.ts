import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ProductVariant } from "./product-variant";

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn('uuid')
    imageId: string;

    @Column('varchar')
    imageName: string;

    @Column('varchar')
    imageUrl: string;

    @ManyToOne(() => Product, (product) => product.images)
    product: Product;

    @ManyToOne(() => ProductVariant, (pv) => pv.images)
    productVariant: ProductVariant;
}
