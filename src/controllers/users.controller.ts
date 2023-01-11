import { Request, Response } from "express";
import { validate } from "class-validator";

import { AppDataSource } from "../data-source";
import { verifyToken } from "../middlewares/jwt";
import { Users } from "../entity/Users";

export default class UsersController {
    static listAll = async (req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(Users);
        const users = await userRepository.find({
            select: ["username"],
        });

        res.status(200).send(users);
    };
    static getOne = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.userId;

        const userRepository = AppDataSource.getRepository(Users);

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

        const userRepository = AppDataSource.getRepository(Users);

        let user: Users;
        try {
            user = await userRepository.findOneOrFail({ where: { id } });
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
        } catch (error) {
            res.status(401).send("User not found");
        }
    };
    static delete = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.userId;

        const userRepository = AppDataSource.getRepository(Users);
        let user: Users;
        try {
            user = await userRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        res.clearCookie("token").status(200).send("User deleted");
    };
}
