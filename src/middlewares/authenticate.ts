var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// TODO: fix import
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

import config from "../config";

export function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

export function generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}
