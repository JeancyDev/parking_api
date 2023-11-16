import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    name: string;
}
