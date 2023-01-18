import { Router } from "express";

import CollectionController from "../controllers/collection.controller";

const router = Router();

router.get("/listAllCards", CollectionController.listAllCards);
router.get("/listAllFavorites", CollectionController.listAllFavorites);
router.get("/listAllToExchange", CollectionController.listAllToExchange);
// router.get("/getOneToExchange", CollectionController.getOneToExchange);
router.patch("/favoriteCard", CollectionController.favoriteCard);
router.patch("/cardToExchange", CollectionController.cardToExchange);

export default router;
