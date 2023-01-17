import {
    Entity,
    JoinColumn,
    JoinTable,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { CollectionCards } from "./CollectionCards";
import { Users } from "./Users";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(
        () => CollectionCards,
        (collectionCard) => collectionCard.collection,
        {
            eager: true,
            cascade: true,
            onDelete: "CASCADE",
        }
    )
    @JoinTable()
    cards: CollectionCards[];

    @OneToOne(() => Users, (user) => user.collection, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user: Users;
}
