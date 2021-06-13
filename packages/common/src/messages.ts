export interface SessionStarted {
    type: 'session_started';
    players: [string, string];
}

export interface TurnStarted {
    type: 'turn_started';
    turnNumber: number;
    reward: number;
}

export interface CardPlayed {
    type: 'card_played';
    player: string;
}

export interface TurnEnded {
    type: 'turn_ended';
    winner?: string;
    cards: {
        [key: string]: string;
    };
    scores: {
        [key: string]: number;
    };
}

export interface SessionEnded {
    type: 'session_ended';
    winner?: string;
    cards: {
        [key: string]: string;
    };
    scores: {
        [key: string]: number;
    };
}

export type ToClient = SessionStarted | TurnStarted | CardPlayed | TurnEnded | SessionEnded;

export interface MyDeck {
    type: 'my_deck';
    cardIds: string[];
}

export interface PlayCard {
    type: 'play_card';
    id: string;
}

export type ToServer = MyDeck | PlayCard;
