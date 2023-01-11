import { Router } from "express";

import UsersController from "../controllers/users.controller";

const router = Router();

router.patch("/update", UsersController.update);
// router.post("/delete", UsersController.delete);

export default router;
