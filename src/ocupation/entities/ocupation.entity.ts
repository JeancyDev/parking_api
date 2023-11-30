import { Place } from "src/place/entities/place.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ocupation {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Place, (place) => place.ocupation, { nullable: false, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ foreignKeyConstraintName: 'FK_Place' })
    place: Place;

    @OneToOne(() => Reservation, (reservation) => reservation.ocupation, { nullable: false, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ foreignKeyConstraintName: 'FK_Reservation' })
    reservation: Reservation;

    @Column({ type: 'date', nullable: false })
    startDate: Date;

    @Column({ type: 'time', nullable: false })
    startTime: Date;
}