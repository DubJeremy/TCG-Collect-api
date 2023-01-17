import { Request, Response } from "express";
import { validate } from "class-validator";
let bcrypt = require("bcryptjs");

import { AppDataSource } from "../data-source";
import { hashPassword } from "../middlewares/hashPassword";
import { Collection } from "../entity/Collection";
import { Users } from "../entity/Users";
import { Wanted } from "../entity/Wanted";
import { generateToken } from "../middlewares/jwt";

export default class AuthController {
    static register = async (req: Request, res: Response) => {
        let { username, password, email } = req.body;
        const userRepository = AppDataSource.getRepository(Users);
        const collectionRepository = AppDataSource.getRepository(Collection);
        const wantedRepository = AppDataSource.getRepository(Wanted);

        const usernameCheck = await userRepository.find({
            where: { username },
        });
        if (usernameCheck.length > 0) {
            res.send("username already exists");
            return;
        }
        const emailCheck = await userRepository.find({
            where: { email },
        });
        if (emailCheck.length > 0) {
            res.send("email already exists");
            return;
        }

        let collection = new Collection();
        console.log(collection.cards);
        let wanted = new Wanted();
        await collectionRepository.save(collection);
        await wantedRepository.save(wanted);

        let user: Users = new Users();
        user.username = username;
        user.password = password;
        user.email = email;
        user.collection = collection;
        user.wanted = wanted;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.password = hashPassword(password);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send(e);
            return;
        }

        collection.user = user;
        wanted.user = user;
        try {
            await collectionRepository.save(collection);
            await wantedRepository.save(wanted);
        } catch (e) {
            res.status(409).send(e);
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

    static logout(res: Response) {
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
