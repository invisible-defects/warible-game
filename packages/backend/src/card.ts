import { List } from 'immutable';

export type Effect = never;

export interface Card {
    id: string;
    value: number;
    effect?: Effect;
}

export type Deck = List<Card>;

export const getWinner = (cards: [Card, Card]): number => {
    const [c1, c2] = cards;

    if (c1.value > c2.value) {
        return 0;
    }

    if (c1.value < c2.value) {
        return 1;
    }

    return -1;
}

export const getDeck = async (cardIds: string[]): Promise<Deck> => {
    return List(cardIds.map<Card>(i => ({
        id: i,
        value: Number(i.replace('default', ''))
    })));
}
