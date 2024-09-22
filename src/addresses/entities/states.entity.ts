import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { Address } from "./address.entity";

@Entity('states')
export class State {

    @PrimaryGeneratedColumn('uuid')
    state_id: string;

    @Column('varchar', { unique: true, nullable: false })
    state_name: string;

    @ManyToOne(() => Country, country => country.state)
    @JoinColumn({ name: 'country_id' })
    country: Country;

    @OneToMany(() => Address, address => address.country)
    address: Address[];
}