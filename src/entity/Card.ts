import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cardId: string;

    @Column({ default: false })
    wanted: boolean;

    @Column({ default: false })
    preferred: boolean;

    @Column({ default: false })
    duplicate: boolean;
}
