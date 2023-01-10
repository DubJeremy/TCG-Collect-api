import { Router } from "express";

import authRoutes from "./auth.routes";
// TODO Middleware check JWT
// import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.use("/auth", authRoutes);
// router.use("/user", userRoutes);
// router.use("/cards", cardsRoutes);

router.use("*", (req, res) => res.sendStatus(404));

export default router;
