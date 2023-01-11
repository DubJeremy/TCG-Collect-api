import { Request, Response, NextFunction } from "express";
import config from "../config";
let jwt = require("jsonwebtoken");

export function generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
}

// export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
//     const token = <string>req.headers["auth"];
//     let jwtPayload;

//     try {
//         jwtPayload = <any>jwt.verify(token, config.jwtSecret);
//         res.locals.jwtPayload = jwtPayload;
//     } catch (error) {
//         res.status(401).send();
//         return;
//     }

//     const { userId, username, role } = jwtPayload;
//     const newToken = jwt.sign({ userId, username, role }, config.jwtSecret, {
//         expiresIn: "7d",
//     });
//     res.setHeader("token", newToken);

//     next();
// };

export const authorization = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, config.jwtSecret);
        req.userId = data.id;
        req.userRole = data.role;
        req.username = data.username;

        next();
    } catch {
        return res.sendStatus(403);
    }
};

export const refreshToken = (res, data, message) => {
    const newToken = generateToken({
        userId: data.id,
        username: data.username,
        role: data.role,
    });
    res.clearCookie("token")
        .cookie("token", newToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2,
        })
        .status(200)
        .send(`${message}`);
};
