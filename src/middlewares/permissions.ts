import config from "../config";

let jwt = require("jsonwebtoken");

function getPermissions(role) {
    switch (role) {
        case "admin":
            return getAdminPermissions();
        case "user":
            return getUserPermissions();
        default:
            return [];
    }
}
// TODO: add permissions
function getUserPermissions() {
    return [""];
}

function getAdminPermissions() {
    return [""];
}

export function checkPermissions(permission) {
    const [module, method] = permission.split(":");
    return (req, res, next) => {
        if (req.session && req.session.userPermissions) {
            if (req.session.userPermissions.includes(permission)) {
                return next();
            }
            if (req.session.userPermissions.includes(`${module}:*`)) {
                return next();
            }
        }
        return res.sendStatus(403);
    };
}

export function verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
}

export function authenticatedRoute(req, res, next) {
    const authorizationHeader = req.header("Authorization");
    let $header, token;

    if (authorizationHeader) {
        [$header, token] = authorizationHeader.split(" ");
    } else {
        token = req.query?.access_token;

        if (!token) {
            return res
                .status(401)
                .json({ error: { message: "Authorization is missing" } });
        }
    }

    try {
        if (token) {
            const payload = verifyToken(token);
            if (payload.id) {
                req.session.userId = payload.id;
                req.session.userPermissions = getPermissions(payload.role);
                return next();
            }
        }
        return res.sendStatus(401);
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.sendStatus(401);
        }
    }
}
