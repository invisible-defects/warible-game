export interface SessionStarted {
    type: 'session_started'
}

export interface TurnStarted {
    type: 'turn_started';
    turnNumber: number;
    reward: number;
}

export interface TurnEnded {
    type: 'turn_ended';
    winner?: string;
    scores: {
        [key: string]: number
    };
}

export interface SessionEnded {
    type: 'session_ended';
    winner?: string;
    scores: {
        [key: string]: number
    };
}

export type ToClient =
    | SessionStarted
    | TurnStarted
    | TurnEnded
    | SessionEnded;

export interface MyDeck {
    type: 'my_deck',
    cardIds: string[]
}

export interface PlayCard {
    type: 'play_card';
    id: string;
}

export type ToServer =
    | MyDeck
    | PlayCard;
