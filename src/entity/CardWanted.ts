import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Card } from "./Card";

@Entity()
export class CardWanted {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Card)
    @JoinTable()
    cards: Card[];
}
