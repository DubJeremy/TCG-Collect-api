import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { Collection } from "../entity/Collection";
import { Users } from "../entity/Users";
import { verifyToken } from "../middlewares/jwt";

export default class CardController {
    static addToCollection = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        const data = await verifyToken(req.cookies.token);
        const userId = data.userId;

        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOneOrFail({
            where: { id: userId },
            select: ["collection"],
        });

        const cardRepository = AppDataSource.getRepository(Card);
        let card = await cardRepository.findOne({
            where: { cardTCGdex },
        });

        if (!card) {
            card = new Card();
            card.cardTCGdex = cardTCGdex;

            await cardRepository.save(card);
        }

        const collectionRepository = AppDataSource.getRepository(Collection);
        let collection = await collectionRepository.findOneOrFail({
            where: { id: user.collection.id },
            relations: {
                cards: true,
            },
        });

        const cardExists = collection.cards.some(
            (card) => card.cardTCGdex === cardTCGdex
        );
        if (cardExists) {
            res.send("card already in the collection");
            return;
        }

        collection.cards.push(card);
        await collectionRepository.save(collection);

        res.status(200).send("Card added to the collection");
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
