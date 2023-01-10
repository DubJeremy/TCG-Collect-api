import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

import { CardCollection } from "./CardCollection";
import { CardWanted } from "./CardWanted";

export type UserRoleType = "admin" | "user";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsNotEmpty()
    username: string;

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @Length(6, 100)
    password: string;

    @OneToOne(() => CardCollection, {
        cascade: true,
    })
    @JoinColumn()
    card_collection_id: CardCollection;

    @OneToOne(() => CardWanted, {
        cascade: true,
    })
    @JoinColumn()
    card_wanted_id: CardWanted;

    @Column({ default: "user" })
    role: UserRoleType;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
