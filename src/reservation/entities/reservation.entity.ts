import { Place } from "src/place/entities/place.entity";
import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vehicule, (vehicule) => vehicule.id)
    vehicule: Vehicule;

    @Column({ type: 'numeric' })
    time: number;

    @Column({ type: 'date' })
    date: Date;

    @ManyToOne(() => Place, (place) => place.id)
    place: Place;
}
