import { Ocupation } from "src/ocupation/entities/ocupation.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicule {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    brand: string;

    @Column({ type: 'text' })
    model: string;

    @Column({
        type: 'text',
        unique: true
    })
    registration: string;

    @OneToOne(
        () => User,
        {
            nullable: false,
            onDelete: 'CASCADE',
        })
    @JoinColumn({ foreignKeyConstraintName: 'FK_Usuario' })
    user: User;

    @OneToMany(
        () => Reservation,
        (reservation) => reservation.id,
        {
            nullable: false,
            onDelete: 'CASCADE'
        })
    @JoinColumn({ foreignKeyConstraintName: 'FK_Reservaciones' })
    reservations?: Reservation[];

    @OneToOne(() => Ocupation, (ocupation) => ocupation.vehicule)
    ocupation?: Ocupation;
}
