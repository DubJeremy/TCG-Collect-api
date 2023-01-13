import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { Users } from "../entity/Users";

export default class CardController {
    static addToCollection = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;

        const cardRepository = AppDataSource.getRepository(Card);
        let card: Card;
        try {
            card = await cardRepository.findOneOrFail({
                where: { cardTCGdex },
            });
        } catch {
            card = new Card();
            card.cardTCGdex = cardTCGdex;

            await cardRepository.save(card);
        }
    };
    static getById = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;

        const cardRepository = AppDataSource.getRepository(Card);

        try {
            const card = await cardRepository.findOneOrFail({
                where: { cardTCGdex },
            });

            res.status(200).send(card);
        } catch (error) {
            res.status(404).send("Card not found");
        }
    };
    static edit = async (req: Request, res: Response) => {
        let { cardTCGdex, wanted, preferred, to_exchange } = req.body;
    };
    // TODO delete for admin
    static delete = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;

        const cardRepository = AppDataSource.getRepository(Card);
        let card: Card;
        try {
            card = await cardRepository.findOneOrFail({
                where: { cardTCGdex },
            });
        } catch (error) {
            res.status(404).send("Card not found");
            return;
        }
        cardRepository.delete(cardTCGdex);

        res.status(200).send("Card deleted");
    };
}
