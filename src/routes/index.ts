import { Router } from "express";

import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import cardsRoutes from "./card.routes";
import { authorization } from "../middlewares/jwt";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", authorization, usersRoutes);
router.use("/cards", cardsRoutes);
// TODO remettre authorization
// router.use("/cards", authorization, cardsRoutes);

router.use("*", (req, res) => res.sendStatus(404));

export default router;
