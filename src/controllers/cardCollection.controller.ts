import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CardCollection } from "../entity/CardCollection";

export default class CardCollectionController {
    static create = async (req: Request, res: Response) => {
        let cardCollection = new CardCollection();
        const cardCollectionRepository =
            AppDataSource.getRepository(CardCollection);
        try {
            await cardCollectionRepository.save(cardCollection);
        } catch (e) {
            return res.send(e);
        }
        return;
    };
}
