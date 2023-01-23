import { Router } from "express";

import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.delete("/logout", AuthController.logout);
// router.post('/reset-password', AuthController.resetPassword);

export default router;
