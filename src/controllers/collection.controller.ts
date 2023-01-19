import { Request, Response } from "express";
import e = require("express");

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { Collection } from "../entity/Collection";
import { CollectionCards } from "../entity/CollectionCards";
import { verifyToken } from "../middlewares/checking";

const collectionRepository = AppDataSource.getRepository(Collection);
const cardRepository = AppDataSource.getRepository(Card);
const collectionCardsRepository = AppDataSource.getRepository(CollectionCards);

export default class CollectionController {
    static listAllCards = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.collectionId;
        const collection = await collectionRepository.findOneOrFail({
            where: { id: id },
        });

        const cards = await AppDataSource.getRepository(Card)
            .createQueryBuilder("card")
            .leftJoinAndSelect("card.collections", "collections")
            .where("collections.collection.id = :id", {
                id: collection.id,
            })
            .getMany();

        const cardTCGdex = cards.map((card) => card.cardTCGdex);
        if (cardTCGdex.length === 0) {
            res.send("The collection is empty");
            return;
        }

        res.status(200).send(cardTCGdex);
    };
    static listAllFavorites = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.collectionId;
        const collection = await collectionRepository.findOneOrFail({
            where: { id: id },
        });

        const collectionCards = await AppDataSource.getRepository(
            CollectionCards
        )
            .createQueryBuilder("collectionCards")
            .leftJoinAndSelect("collectionCards.card", "card")
            .where("collectionCards.collection.id = :id", {
                id: collection.id,
            })
            .andWhere("collectionCards.favorite = true")
            .getMany();

        const cards = collectionCards.map(
            (collectionCard) => collectionCard.card
        );
        if (cards.length === 0) {
            res.send("There is no preferred card");
            return;
        }

        res.status(200).send(cards);
    };
    static listAllToExchange = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.collectionId;
        const collection = await collectionRepository.findOneOrFail({
            where: { id: id },
        });

        const collectionCards = await AppDataSource.getRepository(
            CollectionCards
        )
            .createQueryBuilder("collectionCards")
            .leftJoinAndSelect("collectionCards.card", "card")
            .where("collectionCards.collection.id = :id", {
                id: collection.id,
            })
            .andWhere("collectionCards.to_exchange = true")
            .getMany();

        const cards = collectionCards.map(
            (collectionCard) => collectionCard.card
        );
        if (cards.length === 0) {
            res.send("There is no card to exchange");
            return;
        }

        res.status(200).send(cards);
    };
    static favoriteCard = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        const data = await verifyToken(req.cookies.token);
        const id = data.collectionId;
        const collection = await collectionRepository.findOneOrFail({
            where: { id: id },
        });
        const card = await cardRepository.findOneOrFail({
            where: { cardTCGdex: cardTCGdex },
        });

        const collectionCard = await collectionCardsRepository.findOne({
            where: { card: card, collection: collection },
        });

        if (collectionCard === null) {
            res.send("An error has occurred");
            return;
        }

        if (collectionCard.favorite === true) {
            collectionCard.favorite = false;
        } else if (collectionCard.favorite === false) {
            collectionCard.favorite = true;
        } else {
            res.send("An error has occurred");
            return;
        }

        try {
            await collectionCardsRepository.save(collectionCard);
        } catch (e) {
            res.status(409).send(e);
        }

        if (collectionCard.favorite === true) {
            res.status(200).send("Card added to favorites");
            return;
        }
        res.status(200).send("Card removed from favorites");
    };
    static cardToExchange = async (req: Request, res: Response) => {
        let { cardTCGdex } = req.body;
        const data = await verifyToken(req.cookies.token);
        const id = data.collectionId;
        const collection = await collectionRepository.findOneOrFail({
            where: { id: id },
        });
        const card = await cardRepository.findOneOrFail({
            where: { cardTCGdex: cardTCGdex },
        });

        const collectionCard = await collectionCardsRepository.findOne({
            where: { card: card, collection: collection },
        });

        if (collectionCard === null) {
            res.send("An error has occurred");
            return;
        }

        if (collectionCard.to_exchange === true) {
            collectionCard.to_exchange = false;
        } else if (collectionCard.to_exchange === false) {
            collectionCard.to_exchange = true;
        } else {
            res.send("An error has occurred");
            return;
        }

        try {
            await collectionCardsRepository.save(collectionCard);
        } catch (e) {
            res.status(409).send(e);
        }

        if (collectionCard.to_exchange === true) {
            res.status(200).send(
                "The card has been added to the list of cards to be exchanged"
            );
            return;
        }
        res.status(200).send(
            "The card has been removed from the list of cards to be exchanged."
        );
    };

    //TODO getOneToExchange
    // static getOneToExchange = async (req: Request, res: Response) => {
    //     const data = await verifyToken(req.cookies.token);
    //     const id = data.userId;
    //     const user = await userRepository.findOneOrFail({
    //         where: { id: id },
    //         select: ["collection"],
    //     });

    //     const cards = await AppDataSource.getRepository(Card)
    //         .createQueryBuilder("card")
    //         .leftJoinAndSelect("card.collections", "collections")
    //         .where("collections.collection.id = :id", {
    //             id: user.collection.id,
    //         })
    //         .getMany();

    //     const cardTCGdex = cards.map((card) => card.cardTCGdex);
    //     if (cardTCGdex.length === 0) {
    //         res.send("The collection is empty");
    //         return;
    //     }

    //     res.status(200).send(cardTCGdex);
    // };
}
