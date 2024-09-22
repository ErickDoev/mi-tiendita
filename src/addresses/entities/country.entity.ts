import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { State } from './states.entity';
import { Address } from './address.entity';

@Entity('countries')
export class Country {
    
    @PrimaryGeneratedColumn('uuid')
    country_id: string;

    @Column('varchar', { unique: true, nullable: false })
    country_name: string;

    @OneToMany(() => State, state => state.country)
    state: State[];

    @OneToMany(() => Address, address => address.country)
    address: Address[];
}