import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cardId: string;

    @Column()
    wanted: boolean;

    @Column()
    preferred: boolean;
}
