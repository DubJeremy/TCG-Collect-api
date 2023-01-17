import { Request, Response } from "express";
import { FindOperator, In } from "typeorm";

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { CollectionCards } from "../entity/CollectionCards";
import { Users } from "../entity/Users";
import { verifyToken } from "../middlewares/jwt";

export default class CollectionController {
    static listAllCards = async (req: Request, res: Response) => {
        const data = await verifyToken(req.cookies.token);
        const id = data.userId;
        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOneOrFail({
            where: { id: id },
            select: ["collection"],
        });

        const cards = await AppDataSource.getRepository(Card)
            .createQueryBuilder("card")
            .leftJoinAndSelect("card.collections", "collections")
            .where("collections.collection.id = :id", {
                id: user.collection.id,
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
        const id = data.userId;
        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOneOrFail({
            where: { id: id },
            select: ["collection"],
        });

        const collectionCards = await AppDataSource.getRepository(
            CollectionCards
        )
            .createQueryBuilder("collectionCards")
            .leftJoinAndSelect("collectionCards.card", "card")
            .where("collectionCards.collection.id = :id", {
                id: user.collection.id,
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
        const id = data.userId;
        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOneOrFail({
            where: { id: id },
            select: ["collection"],
        });

        const collectionCards = await AppDataSource.getRepository(
            CollectionCards
        )
            .createQueryBuilder("collectionCards")
            .leftJoinAndSelect("collectionCards.card", "card")
            .where("collectionCards.collection.id = :id", {
                id: user.collection.id,
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

    //TODO getOneToExchange
    // static getOneToExchange = async (req: Request, res: Response) => {
    //     const data = await verifyToken(req.cookies.token);
    //     const id = data.userId;
    //     const userRepository = AppDataSource.getRepository(Users);
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
