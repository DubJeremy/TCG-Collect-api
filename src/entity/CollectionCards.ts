import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Card } from "./Card";
import { Collection } from "./Collection";

@Entity()
export class CollectionCards {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Collection, (collection) => collection.cards)
    collection: Collection;

    @ManyToOne((type) => Card, (card) => card.collections)
    card: Card;

    @Column({ default: false })
    favorite: boolean;

    @Column({ default: false })
    to_exchange: boolean;
}
