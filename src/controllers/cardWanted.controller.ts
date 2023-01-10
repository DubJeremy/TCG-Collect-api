import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CardWanted } from "../entity/CardWanted";

export default class CardWantedController {
    static create = async (req: Request, res: Response) => {
        let cardWanted = new CardWanted();
        const cardWantedRepository = AppDataSource.getRepository(CardWanted);
        try {
            await cardWantedRepository.save(cardWanted);
        } catch (e) {
            return res.send(e);
        }
        return;
    };
}
