import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('roles')
export class Role {

    @PrimaryGeneratedColumn('uuid')
    role_id: string;

    @Column({ unique: true, nullable: false })
    role_name: string;  
    
    @OneToMany(() => User, (user) => user.role)
    user: User[];
}