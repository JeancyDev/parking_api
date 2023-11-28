import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ type: 'text', default: 'cliente' })
    rol: string;

}