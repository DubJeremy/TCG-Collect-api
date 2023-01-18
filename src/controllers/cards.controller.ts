import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { Collection } from "../entity/Collection";
import { CollectionCards } from "../entity/CollectionCards";
import { Users } from "../entity/Users";
import { Wanted } from "../entity/Wanted";
import { verifyToken } from "../middlewares/checking";

const collectionCardsRepository = AppDataSource.getRepository(CollectionCards);
const cardRepository = AppDataSource.getRepository(Card);
const userRepository = AppDataSource.getRepository(Users);
const wantedRepository = AppDataSource.getRepository(Wanted);
const collectionRepository = AppDataSource.getRepository(Collection);

export default class CardController {
    static addToCollection = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        const data = await verifyToken(req.cookies.token);
        const userId = data.userId;
        const user = await userRepository.findOneOrFail({
            where: { id: userId },
            select: ["collection"],
        });
        let card = await cardRepository.findOne({
            where: { cardTCGdex },
        });
        if (!card) {
            card = new Card();
            card.cardTCGdex = cardTCGdex;
            card.collections = [];
            await cardRepository.save(card);
        }

        let collection = await collectionRepository.findOneOrFail({
            where: { id: user.collection.id },
        });

        const alreadyJoined = await AppDataSource.getRepository(CollectionCards)
            .createQueryBuilder("collectionCards")
            .leftJoinAndSelect("collectionCards.card", "card")
            .where("collectionCards.collection.id = :id", {
                id: collection.id,
            })
            .andWhere("collectionCards.card = :card", {
                card: card.id,
            })
            .getMany();

        if (alreadyJoined.length > 0) {
            res.send("Card already in the collection");
            return;
        }

        let collectionCards = await new CollectionCards();
        collectionCards.collection = collection;
        collectionCards.card = card;
        await collectionCardsRepository.save(collectionCards);

        let wanted = await wantedRepository.findOneOrFail({
            where: { id: user.wanted.id },
            relations: {
                cards: true,
            },
        });
        const cardExists = wanted.cards.some(
            (card) => card.cardTCGdex === cardTCGdex
        );
        if (cardExists) {
            wanted.cards = wanted.cards.filter((card) => {
                return card.cardTCGdex !== cardTCGdex;
            });
            await wantedRepository.save(wanted);
        }

        card.collections.push(collectionCards);
        collection.cards.push(collectionCards);
        try {
            await cardRepository.save(card);
            await collectionRepository.save(collection);
        } catch (e) {
            res.status(409).send(e);
            return;
        }
        res.status(200).send("Card added to the collection");
    };
    static addToWanted = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        const data = await verifyToken(req.cookies.token);
        const userId = data.userId;
        const user = await userRepository.findOneOrFail({
            where: { id: userId },
            select: ["wanted"],
        });
        let card = await cardRepository.findOne({
            where: { cardTCGdex },
        });
        if (!card) {
            card = new Card();
            card.cardTCGdex = cardTCGdex;
            await cardRepository.save(card);
        }

        let wanted = await wantedRepository.findOneOrFail({
            where: { id: user.wanted.id },
            relations: {
                cards: true,
            },
        });
        const cardExists = wanted.cards.some(
            (card) => card.cardTCGdex === cardTCGdex
        );
        if (cardExists) {
            res.send("Card already wanted");
            return;
        }

        const carAlreadyInCollection = await AppDataSource.getRepository(
            CollectionCards
        )
            .createQueryBuilder("collectionCards")
            .leftJoinAndSelect("collectionCards.card", "card")
            .where("collectionCards.collection.id = :id", {
                id: user.collection.id,
            })
            .andWhere("collectionCards.card = :card", {
                card: card.id,
            })
            .getMany();

        if (carAlreadyInCollection.length > 0) {
            res.send("Card already in your collection");
            return;
        }
        wanted.cards.push(card);
        await wantedRepository.save(wanted);
        res.status(200).send("Card added to the wanted list");
    };
    static getOne = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        try {
            const card = await cardRepository.findOneOrFail({
                where: { cardTCGdex },
            });
            res.status(200).send(card);
        } catch (error) {
            res.status(404).send("Card not found");
        }
    };
    static update = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.userId;
        let { cardTCGdex, preferred, to_exchange } = req.body;

        let user: Users;
        try {
            user = await userRepository.findOneOrFail({ where: { id } });
        } catch {
            res.status(401).send("User not found");
        }
    };
    static removeFromCollection = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        const data = await verifyToken(req.cookies.token);
        const userId = data.userId;
        const user = await userRepository.findOneOrFail({
            where: { id: userId },
            select: ["collection"],
        });
        const card = await cardRepository.findOneOrFail({
            where: { cardTCGdex: cardTCGdex },
        });

        const collectionCards = await AppDataSource.getRepository(
            CollectionCards
        )
            .createQueryBuilder("collectionCards")
            .leftJoinAndSelect("collectionCards.card", "card")
            .leftJoinAndSelect("collectionCards.collection", "collection")
            .where("collectionCards.card = :card", {
                card: card.id,
            })
            .andWhere("collectionCards.collection = :collection", {
                collection: user.collection.id,
            })
            .getMany();

        if (collectionCards.length === 0) {
            res.status(409).send("This card is not in the collection");
            return;
        }

        try {
            await collectionCardsRepository.remove(collectionCards);
        } catch (e) {
            res.status(409).send(e);
            return;
        }
        res.status(200).send("Card remove from the collection");
    };
    static removeFromWanted = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        const data = await verifyToken(req.cookies.token);
        const userId = data.userId;
        const user = await userRepository.findOneOrFail({
            where: { id: userId },
            select: ["wanted"],
        });
        let wanted = await wantedRepository.findOneOrFail({
            where: { id: user.wanted.id },
            relations: {
                cards: true,
            },
        });
        const cardExists = wanted.cards.some(
            (card) => card.cardTCGdex === cardTCGdex
        );
        if (!cardExists) {
            res.status(409).send("This card is not in the Wanted list");
            return;
        }
        wanted.cards = wanted.cards.filter((card) => {
            return card.cardTCGdex !== cardTCGdex;
        });
        try {
            await wantedRepository.save(wanted);
        } catch (e) {
            res.status(409).send(e);
            return;
        }
        res.status(200).send("Card remove from the wanted list");
    };

    // TODO delete for admin
    static delete = async (req: Request, res: Response) => {
        // let { cardTCGdex } = req.body;
        // let card: Card;
        // try {
        //     card = await cardRepository.findOneOrFail({
        //         where: { cardTCGdex },
        //     });
        // } catch (error) {
        //     res.status(404).send("Card not found");
        //     return;
        // }
        // cardRepository.delete(cardTCGdex);
        // res.status(200).send("Card deleted");
    };
}
