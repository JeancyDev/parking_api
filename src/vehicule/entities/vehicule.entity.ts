import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicule {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    mark: string;

    @Column({ type: 'text' })
    model: string;

    @Column({ type: 'text', unique: true })
    registration: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
    owner: User;
}
