import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from './country.entity';
import { State } from "./states.entity";
import { User } from "src/users/entities";

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    address_id: string;

    @Column('varchar', { nullable: false })
    address: string;

    @Column('varchar', { nullable: true })
    address_extra: string;

    @ManyToOne(() => Country, country => country.address)
    @JoinColumn({ name: 'country_id'})
    country: Country;

    @ManyToOne(() => State, state => state.address)
    @JoinColumn({ name: 'state_id'})
    state: State;

    @Column('varchar', { nullable: false })
    city: string;

    @Column('varchar', { nullable: false })
    cp: string;

    @Column('varchar', { nullable: false })
    address_phone: string;

    @Column('varchar', { nullable: false, default: false })
    is_default: boolean;
    
    @ManyToOne(() => User,user => user.address)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
