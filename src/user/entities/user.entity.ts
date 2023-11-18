import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => Vehicule, (vehicule) => vehicule.owner)
    vehicules: Vehicule[];
}