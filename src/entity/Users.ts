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

import { Collection } from "./Collection";
import { Wanted } from "./Wanted";

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

    @OneToOne(() => Collection, (collection) => collection.user, {
        eager: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    collection: Collection;

    @OneToOne(() => Wanted, (wanted) => wanted.user, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    wanted: Wanted;

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
