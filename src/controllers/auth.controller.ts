import { Request, Response } from "express";
import { validate } from "class-validator";
let bcrypt = require("bcryptjs");

import { AppDataSource } from "../data-source";
import { hashPassword } from "../middlewares/hashPassword";
import CardCollectionController from "./cardCollection.controller";
import { CardCollection } from "../entity/CardCollection";
import { Users } from "../entity/Users";
import CardWantedController from "./cardWanted.controller";
import { CardWanted } from "../entity/CardWanted";
import { generateToken } from "../middlewares/jwt";

export default class AuthController {
    static register = async (req: Request, res: Response) => {
        let { username, password, email } = req.body;
        const userRepository = AppDataSource.getRepository(Users);

        try {
            const usernameCheck = await userRepository.findOneOrFail({
                where: [{ username }],
            });

            if (usernameCheck) {
                res.send("username already exists");
                return;
            }
        } catch {
            const emailCheck = await userRepository.findOneOrFail({
                where: [{ email }],
            });
            if (emailCheck) {
                res.send("email already exists");
                return;
            }
        }

        await CardCollectionController.create(req, res);
        await CardWantedController.create(req, res);

        const collection = await AppDataSource.manager.find(CardCollection);
        const wanted = await AppDataSource.manager.find(CardWanted);

        let user: Users = new Users();
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

        res.cookie("token", token, {
            path: "/",
            secure: true,
            // secure: process.env.NODE_ENV === "production",
            httpOnly: true, //le httpOnly n'est pas accessible via du code JS, ça limite un peu les injection XSS (mais ce n'est pas infaillible)
            maxAge: 1000 * 60 * 60 * 2, //2 heures
        }).send(`${token} "logged"`);
    };

    static logout(req: Request, res: Response) {
        return res
            .clearCookie("token")
            .send("logout")
            .status(200)
            .send("logged out");
    }
    //TODO : reset password
    // static async resetPassword(req, res) {
    //     try {
    //         const { email } = req.body;

    //         const user = await User.findOne({ email });

    //         if (user) {
    //             let token = await ResetToken.findOne({ user: user._id });
    //             if (token) {
    //                 await token.deleteOne();
    //             }
    //             let resetToken = crypto.randomBytes(32).toString('hex');
    //             const hash = await hashPassword(resetToken);

    //             await new ResetToken({
    //                 user: user._id,
    //                 token: hash,
    //                 createdAt: Date.now(),
    //             }).save();

    //             await resetLink(user.email, req.headers['x-forwarded-for'] || req.socket.remoteAddress, hash);
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     } finally {
    //         return res.sendStatus(200);
    //     }
    // }
}
