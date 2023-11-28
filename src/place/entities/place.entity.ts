import { Ocupation } from "src/ocupation/entities/ocupation.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    name: string;

    @OneToMany(() => Reservation, (reservation) => reservation.place)
    reservations: Reservation[];

    @OneToOne(() => Ocupation, (ocupation) => ocupation.place)
    ocupation?: Ocupation;
}
