import { Router } from "express";

import UsersController from "../controllers/users.controller";

const router = Router();

router.patch("/update", UsersController.update);
router.delete("/delete", UsersController.delete);

export default router;
