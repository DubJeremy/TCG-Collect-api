import { Collection } from "./collection.model";

export class Card {
    id: number;
    cardTCGdex: string;
    collections: Collection[];
}
