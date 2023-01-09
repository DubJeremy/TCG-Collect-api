import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    card_id: string;

    @Column({ default: false })
    preferred: boolean;

    @Column({ default: false })
    to_exchange: boolean;
}
