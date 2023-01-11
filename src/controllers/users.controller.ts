import { Request, Response } from "express";
import { validate } from "class-validator";

import { AppDataSource } from "../data-source";
import { refreshToken, verifyToken } from "../middlewares/jwt";
import { Users } from "../entity/Users";

export default class UsersController {
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

            return refreshToken(res, data, "User edited");
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
