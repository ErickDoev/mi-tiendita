import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('genders')
export class Gender {

    @PrimaryGeneratedColumn('uuid')
    gender_id: string;

    @Column({ unique: true, nullable: false })
    gender_name: string;

    @OneToMany(() => User, (user) => user.gender)
    user: User[];
}