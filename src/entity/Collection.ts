import {
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Card } from "./Card";
import { Users } from "./Users";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Card, { cascade: true })
    @JoinTable()
    cards: Card[];

    @OneToOne(() => Users, (user) => user.collection, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user: Users;
}
