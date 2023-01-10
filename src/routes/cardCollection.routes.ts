import { Router } from "express";

import CardCollectionController from "../controllers/cardCollection.controller";
import config from "../config";

const router = Router();

router.post("/create", CardCollectionController.create);

export default router;
