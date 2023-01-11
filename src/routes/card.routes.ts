import { Router } from "express";

import CardController from "../controllers/cards.controller";

const router = Router();

router.post("/create", CardController.addToCollection);
router.get("/getById", CardController.getById);
router.patch("/edit", CardController.edit);
router.delete("/delete", CardController.delete);

export default router;
