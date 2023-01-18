import { Request, Response } from "express";
import { validate } from "class-validator";

import { AppDataSource } from "../data-source";
import { verifyToken } from "../middlewares/checking";
import { Users } from "../entity/Users";
import { Collection } from "../entity/Collection";
import { Wanted } from "../entity/Wanted";

const userRepository = AppDataSource.getRepository(Users);
const wantedRepository = AppDataSource.getRepository(Wanted);
const collectionRepository = AppDataSource.getRepository(Collection);

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
                select: ["username"],
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
        const id = data.userId;
        let user: Users;
        let collection: Collection;
        let wanted: Wanted;

        try {
            user = await userRepository.findOne({ where: { id: id } });
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        try {
            collection = await collectionRepository.findOne({
                where: { id: user.collection.id },
            });
        } catch (error) {
            res.status(404).send(error);
            return;
        }

        try {
            wanted = await wantedRepository.findOne({
                where: { id: user.wanted.id },
            });
        } catch (error) {
            res.status(404).send(error);
            return;
        }

        await collectionRepository.remove(collection);
        await wantedRepository.remove(wanted);

        res.clearCookie("token").status(200).send("User deleted");
    };
}
