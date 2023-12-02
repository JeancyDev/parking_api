import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./user.rol";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    fullName: string;

    @Column({ type: 'text', unique: true })
    userName: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'enum', default: Rol.cliente, enum: Rol })
    rol: Rol;

}