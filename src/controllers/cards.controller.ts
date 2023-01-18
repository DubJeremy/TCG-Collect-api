import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { Collection } from "../entity/Collection";
import { CollectionCards } from "../entity/CollectionCards";
import { Users } from "../entity/Users";
import { Wanted } from "../entity/Wanted";
import { verifyToken } from "../middlewares/checking";

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
            card.collections = [];
            await cardRepository.save(card);
            console.log("la carte n'existait pas");
        }

        const collectionRepository = AppDataSource.getRepository(Collection);
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
        const collectionCardsRepository = await AppDataSource.getRepository(
            CollectionCards
        );
        let collectionCards = await new CollectionCards();
        collectionCards.collection = collection;
        collectionCards.card = card;
        await collectionCardsRepository.save(collectionCards);

        const wantedRepository = AppDataSource.getRepository(Wanted);
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
        //     let { cardTCGdex } = req.body;
        //     const data = await verifyToken(req.cookies.token);
        //     const userId = data.userId;
        //     const userRepository = AppDataSource.getRepository(Users);
        //     const user = await userRepository.findOneOrFail({
        //         where: { id: userId },
        //         select: ["wanted"],
        //     });
        //     const cardRepository = AppDataSource.getRepository(Card);
        //     let card = await cardRepository.findOne({
        //         where: { cardTCGdex },
        //     });
        //     if (!card) {
        //         card = new Card();
        //         card.cardTCGdex = cardTCGdex;
        //         await cardRepository.save(card);
        //     }
        //     const wantedRepository = AppDataSource.getRepository(Wanted);
        //     let wanted = await wantedRepository.findOneOrFail({
        //         where: { id: user.wanted.id },
        //         relations: {
        //             cards: true,
        //         },
        //     });
        //     let cardExists = wanted.cards.some(
        //         (card) => card.cardTCGdex === cardTCGdex
        //     );
        //     if (cardExists) {
        //         res.send("Card already wanted");
        //         return;
        //     }
        //     const collectionRepository = AppDataSource.getRepository(Collection);
        //     let collection = await collectionRepository.findOneOrFail({
        //         where: { id: user.collection.id },
        //         relations: {
        //             cards: true,
        //         },
        //     });
        //     cardExists = collection.cards.some(
        //         (card) => card.cardTCGdex === cardTCGdex
        //     );
        //     if (cardExists) {
        //         res.send("Card already in your collection");
        //         return;
        //     }
        //     wanted.cards.push(card);
        //     await wantedRepository.save(wanted);
        //     res.status(200).send("Card added to the wanted list");
    };
    static getOne = async (req: Request, res: Response) => {
        //     let { cardTCGdex } = req.body;
        //     const cardRepository = AppDataSource.getRepository(Card);
        //     try {
        //         const card = await cardRepository.findOneOrFail({
        //             where: { cardTCGdex },
        //         });
        //         res.status(200).send(card);
        //     } catch (error) {
        //         res.status(404).send("Card not found");
    };
    static update = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.userId;
        let { cardTCGdex, preferred, to_exchange } = req.body;
        const userRepository = AppDataSource.getRepository(Users);

        let user: Users;
        try {
            user = await userRepository.findOneOrFail({ where: { id } });
        } catch {
            res.status(401).send("User not found");
        }
    };
    static removeFromCollection = async (req: Request, res: Response) => {
        // let { cardTCGdex } = req.body;
        // const data = await verifyToken(req.cookies.token);
        // const userId = data.userId;
        // const userRepository = AppDataSource.getRepository(Users);
        // const user = await userRepository.findOneOrFail({
        //     where: { id: userId },
        //     select: ["collection"],
        // });
        // const collectionRepository = AppDataSource.getRepository(Collection);
        // let collection = await collectionRepository.findOneOrFail({
        //     where: { id: user.collection.id },
        //     relations: {
        //         cards: true,
        //     },
        // });
        // const cardExists = collection.cards.some(
        //     (card) => card.cardTCGdex === cardTCGdex
        // );
        // if (!cardExists) {
        //     res.status(409).send("This card is not in the collection");
        //     return;
        // }
        // collection.cards = collection.cards.filter((card) => {
        //     return card.cardTCGdex !== cardTCGdex;
        // });
        // try {
        //     await collectionRepository.save(collection);
        // } catch (e) {
        //     res.status(409).send(e);
        //     return;
        // }
        // res.status(200).send("Card remove from the collection");
    };
    static removeFromWanted = async (req: Request, res: Response) => {
        // let { cardTCGdex } = req.body;
        // const data = await verifyToken(req.cookies.token);
        // const userId = data.userId;
        // const userRepository = AppDataSource.getRepository(Users);
        // const user = await userRepository.findOneOrFail({
        //     where: { id: userId },
        //     select: ["wanted"],
        // });
        // const wantedRepository = AppDataSource.getRepository(Wanted);
        // let wanted = await wantedRepository.findOneOrFail({
        //     where: { id: user.wanted.id },
        //     relations: {
        //         cards: true,
        //     },
        // });
        // const cardExists = wanted.cards.some(
        //     (card) => card.cardTCGdex === cardTCGdex
        // );
        // if (!cardExists) {
        //     res.status(409).send("This card is not in the Wanted list");
        //     return;
        // }
        // wanted.cards = wanted.cards.filter((card) => {
        //     return card.cardTCGdex !== cardTCGdex;
        // });
        // try {
        //     await wantedRepository.save(wanted);
        // } catch (e) {
        //     res.status(409).send(e);
        //     return;
        // }
        // res.status(200).send("Card remove from the wanted list");
    };

    // TODO delete for admin
    static delete = async (req: Request, res: Response) => {
        // let { cardTCGdex } = req.body;
        // const cardRepository = AppDataSource.getRepository(Card);
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
