import { Ocupation } from "src/ocupation/entities/ocupation.entity";
import { Place } from "src/place/entities/place.entity";
import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { BeforeInsert, Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({
        type: 'numeric',
        unique: true
    })
    publicId: number;

    @ManyToOne(
        () => Vehicule,
        (vehicule) => vehicule.id,
        {
            onDelete: 'CASCADE',
            nullable: false
        })
    vehicule: Vehicule;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'time' })
    startTime: Date;

    @Column({ type: 'numeric' })
    time: number;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @ManyToOne(
        () => Place,
        (place) => place.id,
        {
            onDelete: 'CASCADE',
            nullable: false,
        })
    place: Place;

    @OneToOne(() => Ocupation, (ocupation) => ocupation.reservation)
    ocupation?: Ocupation;
}
