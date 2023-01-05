import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import config from "../config";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
// router.post('/update', AuthController.update);

export default router;
