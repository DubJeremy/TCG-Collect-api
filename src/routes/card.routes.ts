import { Router } from "express";

import CardController from "../controllers/cards.controller";

const router = Router();

router.post("/addToCollection", CardController.addToCollection);
router.post("/addToWanted", CardController.addToWanted);
router.put("/removeFromCollection", CardController.removeFromCollection);
router.put("/removeFromWanted", CardController.removeFromWanted);
router.get("/getOne", CardController.getOne);
// TODO delete for admin
router.delete("/delete", CardController.delete);

export default router;
