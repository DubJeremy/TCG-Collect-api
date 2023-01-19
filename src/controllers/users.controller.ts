import { Request, Response } from "express";
import { validate } from "class-validator";

import { AppDataSource } from "../data-source";
import { verifyToken } from "../middlewares/checking";
import { Users } from "../entity/Users";
import { Collection } from "../entity/Collection";
import { Wanted } from "../entity/Wanted";
import { CollectionCards } from "../entity/CollectionCards";

const userRepository = AppDataSource.getRepository(Users);
const wantedRepository = AppDataSource.getRepository(Wanted);
const collectionRepository = AppDataSource.getRepository(Collection);
const collectionCardsRepository = AppDataSource.getRepository(CollectionCards);

export default class UsersController {
    static listAll = async (req: Request, res: Response) => {
        const users = await userRepository.find({
            select: ["username"],
        });

        res.status(200).send(users);
    };
    static getOne = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.userId;

        try {
            const user = await userRepository.findOneOrFail({
                where: { id },
            });

            res.status(200).send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
    };
    static update = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.userId;
        const { username, email } = req.body;

        let user: Users;
        try {
            user = await userRepository.findOneOrFail({ where: { id } });
        } catch {
            res.status(401).send("User not found");
        }
        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send(e.message);
            return;
        }

        return res.status(200).send("User edited");
    };
    static delete = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const userId = data.userId;
        const collectionId = data.collectionId;
        let user = await userRepository.findOneOrFail({
            where: { id: userId },
        });

        try {
            // await collectionRepository.delete({ id: collectionId });
            // await wantedRepository.delete({ id: user.wanted.id });
            // await collectionCardsRepository.delete({
            //     collection: collectionId,
            // });
            await userRepository.delete({ id: userId });
        } catch (e) {
            res.status(409).send(e);
            return;
        }
        res.clearCookie("token").status(200).send("User deleted");
    };
}
