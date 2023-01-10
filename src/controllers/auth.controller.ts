import { Request, Response } from "express";
import { validate } from "class-validator";

let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

import { AppDataSource } from "../data-source";
import { hashPassword } from "../middlewares/bcrypt";
import CardCollectionController from "./cardCollection.controller";
import { CardCollection } from "../entity/CardCollection";
import { Users } from "../entity/Users";
import CardWantedController from "./cardWanted.controller";
import { CardWanted } from "../entity/CardWanted";
import { checkIfUnencryptedPasswordIsValid } from "../middlewares/bcrypt";
import { generateToken } from "../middlewares/jwt";

export default class AuthController {
    static register = async (req: Request, res: Response) => {
        await CardCollectionController.create(req, res);
        await CardWantedController.create(req, res);

        const collection = await AppDataSource.manager.find(CardCollection);
        const wanted = await AppDataSource.manager.find(CardWanted);

        let { username, password, email } = req.body;

        let user = new Users();
        user.username = username;
        user.password = password;
        user.email = email;
        user.card_collection_id = collection[collection.length - 1];
        user.card_wanted_id = wanted[wanted.length - 1];

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.password = hashPassword(password);

        const userRepository = AppDataSource.getRepository(Users);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send(e.detail);
            return;
        }
        res.status(201).send("User created");
    };

    static login = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        if (!((username && password) || (email && password))) {
            res.status(400).send("missing information");
            return;
        }

        const userRepository = AppDataSource.getRepository(Users);
        let user: Users;
        try {
            user = await userRepository.findOneOrFail({
                where: [{ username }, { email }],
            });
            // SELECT * FROM users WHERE username = ? OR email = ?
        } catch (error) {
            res.status(401).send("Invalid username or password");
            return;
        }

        if (!(await bcrypt.compare(password, user.password))) {
            res.status(401).send("Invalid username or password");
            return;
        }

        const token = await generateToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });

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
