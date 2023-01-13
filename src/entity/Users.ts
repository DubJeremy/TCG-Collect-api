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

    @OneToOne(() => CardCollection, (cardCollection) => cardCollection.user, {
        eager: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    collection: CardCollection;

    @OneToOne(() => CardWanted, (cardWanted) => cardWanted.user, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    wanted: CardWanted;

    @Column({ default: "user" })
    role: UserRoleType;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
    length: number;
}
