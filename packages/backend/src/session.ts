import WebSocket from 'ws';
import _ from 'lodash';
import { List } from 'immutable';
import Player from './player';
import { Card, Deck, getWinner, getDeck } from './card';

import { ToClient, ToServer } from 'common';

const allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class Session {
    private players: [Player, Player];
    private callback: (this: WebSocket, data: WebSocket.Data) => void;
    status: 'preparing' | 'playing' | 'finished';

    private rewards: List<number>;
    private currentTurn: number;

    private decks: [Deck, Deck];
    private playedCards: [Card | undefined, Card | undefined];
    private scores: [number, number];

    constructor(players: [Player, Player]) {
        this.players = players;

        const s = this;
        this.callback = function (this: WebSocket, data: WebSocket.Data) {
            const pIdx = s.players.findIndex((p) => p.ws === this);
            const message = JSON.parse(data as string) as ToServer;
            s.onMessage(pIdx, message);
        };

        for (const p of this.players) {
            p.ws.on('message', this.callback);
        }

        this.status = 'preparing';

        this.rewards = List(_.shuffle(allCards));
        this.currentTurn = 1;
        this.playedCards = [undefined, undefined];
        this.scores = [0, 0];

        this.send({
            type: 'session_started',
            players: [this.players[0].id, this.players[1].id],
        });

        this.decks = [List(), List()];
    }

    onMessage(pIdx: number, message: ToServer) {
        console.log({ pIdx, message });
        switch (message.type) {
            case 'my_deck': {
                if (this.status !== 'preparing') {
                    return;
                }

                getDeck(message.cardIds).then((deck) => {
                    this.decks[pIdx] = deck;

                    if (this.decks[0].count() > 0 && this.decks[1].count() > 0) {
                        this.status = 'playing';
                        this.startTurn();
                    }
                });

                break;
            }
            case 'play_card': {
                if (this.status !== 'playing') {
                    return;
                }

                if (this.playedCards[pIdx] !== undefined) {
                    break;
                }

                this.send({
                    type: 'card_played',
                    player: this.players[pIdx].id,
                });

                const cardIdx = this.decks[pIdx].findIndex((c) => c.id === message.id);
                const card = this.decks[pIdx].get(cardIdx)!;
                this.decks[pIdx] = this.decks[pIdx].remove(cardIdx);

                this.playedCards[pIdx] = card;
                this.checkForEndOfTurn();
                break;
            }
        }
    }

    send(message: ToClient, pIdx: number | undefined = undefined) {
        let toSend = [0, 1];
        if (pIdx !== undefined) {
            toSend = [pIdx];
        }

        const data = JSON.stringify(message);

        for (const idx of toSend) {
            this.players[idx].ws.send(data);
        }
    }

    reward() {
        return this.rewards.get(0)!;
    }

    startTurn() {
        this.playedCards = [undefined, undefined];
        this.send({
            type: 'turn_started',
            turnNumber: this.currentTurn,
            reward: this.reward(),
        });
    }

    checkForEndOfTurn() {
        const [c1, c2] = this.playedCards;
        if (c1 !== undefined && c2 !== undefined) {
            setTimeout(() => {
                const winner = getWinner([c1, c2]);

                let winnerId: string | undefined = undefined;
                if (winner === -1) {
                    this.scores[0] += this.reward() / 2;
                    this.scores[1] += this.reward() / 2;
                } else {
                    this.scores[winner] += this.reward();
                    winnerId = this.players[winner].id;
                }

                const cards: {
                    [key: string]: string;
                } = _.fromPairs(
                    this.playedCards.map((card, idx) => {
                        return [this.players[idx].id, card!.id];
                    }),
                );

                const scores: {
                    [key: string]: number;
                } = _.fromPairs(
                    this.scores.map((score, idx) => {
                        return [this.players[idx].id, score];
                    }),
                );

                this.send({
                    type: 'turn_ended',
                    winner: winnerId,
                    cards,
                    scores,
                });

                if (this.currentTurn == 12) {
                    let gameWinnerId: string | undefined = undefined;
                    if (this.scores[0] > this.scores[1]) {
                        gameWinnerId = this.players[0].id;
                    } else if (this.scores[0] < this.scores[1]) {
                        gameWinnerId = this.players[1].id;
                    }
                    setTimeout(() => {
                        this.send({
                            type: 'session_ended',
                            winner: gameWinnerId,
                            cards,
                            scores,
                        });

                        this.status = 'finished';
                    }, 1500);
                } else {
                    this.rewards = this.rewards.shift();
                    this.currentTurn++;

                    setTimeout(() => {
                        this.startTurn();
                    }, 1500);
                }
            }, 500);
        }
    }
}

export default Session;
