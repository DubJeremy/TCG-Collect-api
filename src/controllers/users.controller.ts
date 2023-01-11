import { Request, Response } from "express";
import { validate } from "class-validator";

import { AppDataSource } from "../data-source";
import { refreshToken, verifyToken } from "../middlewares/jwt";
import { Users } from "../entity/Users";

export default class UsersController {
    static update = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);

        const { username, email } = req.body;

        const userRepository = AppDataSource.getRepository(Users);

        let user: Users;
        const id = data.userId;
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
}
