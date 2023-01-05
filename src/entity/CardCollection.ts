import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Card } from "./Card";

@Entity()
export class CardCollection {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany((type) => Card)
    @JoinTable()
    cards: Card[];
}
