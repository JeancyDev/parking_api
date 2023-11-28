import { Place } from "src/place/entities/place.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ocupation {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Vehicule, (vehicule) => vehicule.ocupation, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ foreignKeyConstraintName: 'FK_Vehicule' })
    vehicule: Vehicule;

    @OneToOne(() => Place, (place) => place.ocupation, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ foreignKeyConstraintName: 'FK_Place' })
    place: Place;

    @OneToOne(() => Reservation, (reservation) => reservation.ocupation, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ foreignKeyConstraintName: 'FK_Reservation' })
    reservation: Reservation;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'time' })
    startTime: Date;
}
