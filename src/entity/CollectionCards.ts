import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Card } from "./Card";
import { Collection } from "./Collection";

@Entity()
export class CollectionCards {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Collection, (collection) => collection.cards, {
        onDelete: "CASCADE",
    })
    collection: Collection;

    @ManyToOne((type) => Card, (card) => card.collections, {
        onDelete: "CASCADE",
    })
    card: Card;

    @Column({ default: false })
    favorite: boolean;

    @Column({ default: false })
    to_exchange: boolean;
    length: number;
}
