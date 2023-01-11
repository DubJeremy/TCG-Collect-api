import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./users.routes";
// TODO Middleware check JWT
import { authorization } from "../middlewares/jwt";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", authorization, userRoutes);
// router.use("/cards", cardsRoutes);

router.use("*", (req, res) => res.sendStatus(404));

export default router;
