import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";

let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

import { AppDataSource } from "../data-source";
import { User } from "../model/user.model";
import { hashPassword } from "../middlewares/hashPassword";
import { CardCollection } from "../entity/CardCollection";
import { UserRepository } from "../repository/user.repository";

export default class AuthController {
    static register = async (req: Request, res: Response) => {
        console.log("111");
        const { username, email, password } = req.body;

        // const userRepository = getRepository(User);
        // const userRepository = dataSource.getRepository(User);
        // console.log("222", userRepository);
        const userExist = await UserRepository.findByLogs(username, email);
        // const userExist = await userRepository.findBy({ email: email });
        console.log(userExist);
        const collection = new CardCollection();
        try {
            console.log("333");
            if (userExist) {
                console.log("444");
                const hashedPassword = await hashPassword(password);
                // const hashedPassword = await bcrypt.hash(password, 10);

                const user = new User();
                console.log("555");
                user.username = username;
                user.email = email;
                user.password = hashedPassword;
                user.cardCollection = collection.id;
                console.log("666");
                try {
                    console.log("777");
                    await UserRepository.save(user);
                    res.status(201).send("User created");
                } catch (error) {
                    console.log("888");
                    res.status(409).send(error.message);
                    return;
                }
            }
        } catch (error) {
            res.status(409).send("User already exists");
            return;
        }
    };

    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            res.status(401).send("Invalid username or password");
            return;
        }

        if (!(await bcrypt.compare(password, user.password))) {
            res.status(401).send("Invalid username or password");
            return;
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.send({ token, user });
    };
    //TODO: update fonction
    // static update = async (req: Request, res: Response) => {
    //     const id = req.params.id;

    //     const { username, password } = req.body;

    //     const hashedPassword = await bcrypt.hash(password, 10);

    //     const entityManager = getManager();

    //     let user: User;
    //     try {
    //         user = await entityManager.findOneOrFail(User, id);
    //         user.username = username;
    //         user.password = hashedPassword;
    //         await entityManager.save(user);
    //     } catch (error) {
    //         res.status(404).send("User not found");
    //         return;
    //     }

    //     res.send(user);
    // };
}
