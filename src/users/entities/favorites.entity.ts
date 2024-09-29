import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";
import { ProductVariant } from "src/products/entities";

@Entity('favorites')
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    favorites_id: string;

    @ManyToOne(() => User, (user) => user.favorite)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => ProductVariant, (pv) => pv.favorite)
    @JoinColumn({ name: 'product_variant_id' })
    productVariant: ProductVariant;

    // @Column('int')
    // quantity: number;
}