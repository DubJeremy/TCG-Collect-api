import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { Users } from "../entity/Users";

export default class CardController {
    static addToCollection = async (req: Request, res: Response) => {
        let { card_id } = req.body;

        const cardRepository = AppDataSource.getRepository(Card);
        let card: Card;
        try {
            card = await cardRepository.findOneOrFail({ where: { card_id } });
        } catch {
            card = new Card();
            card.card_id = card_id;

            await cardRepository.save(card);
        }
    };
    static getById = async (req: Request, res: Response) => {
        let { card_id } = req.body;

        const cardRepository = AppDataSource.getRepository(Card);

        try {
            const card = await cardRepository.findOneOrFail({
                where: { card_id },
            });

            res.status(200).send(card);
        } catch (error) {
            res.status(404).send("Card not found");
        }
    };
    static edit = async (req: Request, res: Response) => {
        let { card_id, wanted, preferred, to_exchange } = req.body;
    };
    // TODO delete for admin
    static delete = async (req: Request, res: Response) => {
        let { card_id } = req.body;

        const cardRepository = AppDataSource.getRepository(Card);
        let card: Card;
        try {
            card = await cardRepository.findOneOrFail({ where: { card_id } });
        } catch (error) {
            res.status(404).send("Card not found");
            return;
        }
        cardRepository.delete(card_id);

        res.status(200).send("Card deleted");
    };
}
