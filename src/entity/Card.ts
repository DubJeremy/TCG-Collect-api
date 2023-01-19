import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { CollectionCards } from "./CollectionCards";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    cardTCGdex: string;

    @OneToMany(() => CollectionCards, (collectionCard) => collectionCard.card, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinTable()
    collections: CollectionCards[];
}
