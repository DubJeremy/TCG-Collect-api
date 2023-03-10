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
export class Wanted {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Card)
    @JoinTable()
    cards: Card[];

    @OneToOne(() => Users, (user) => user.wanted, {
        //     eager: true,
        //     cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user: Users;
}
