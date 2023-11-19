import { Reservation } from "src/reservation/entities/reservation.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    name: string;

    @OneToMany(() => Reservation, (reservation) => reservation.id)
    reservations: Reservation[];
}
