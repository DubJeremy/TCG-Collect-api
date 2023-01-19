import { Router } from "express";

import UsersController from "../controllers/users.controller";

const router = Router();

router.get("/getOne", UsersController.getOne);
router.get("/listAll", UsersController.listAll);
router.patch("/update", UsersController.update);
router.delete("/delete", UsersController.delete);

export default router;
