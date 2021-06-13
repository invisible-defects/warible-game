import * as PIXI from 'pixi.js';
import { HelloMsg, ToClient, ToServer } from 'common';

interface HandCard extends PIXI.Sprite {
    id: string;
    value: number;
}

interface Graphics {
    matchmaking: PIXI.Container;
    gameField: PIXI.Container;
    deck: PIXI.Sprite[];
    hand: HandCard[];
    rewardHolder: PIXI.Sprite;
    revealBorders: [PIXI.Container, PIXI.Container];
    reveal: [PIXI.Container, PIXI.Container];
    scores: [PIXI.Text, PIXI.Text];
    crowns: [PIXI.Sprite, PIXI.Sprite];
}

type Status = 'in_queue' | 'waiting' | 'turn_start' | 'turn_wait' | 'turn_end' | 'match_end';

class Game {
    app: PIXI.Application;

    graphics?: Graphics;

    status: Status = 'in_queue';

    id: string;
    ws: WebSocket;
    opponentId?: string;

    constructor() {
        this.app = new PIXI.Application({
            width: 480,
            height: 270,
            sharedLoader: true,
            sharedTicker: true,
            transparent: true,
            antialias: true,
        });

        this.app.stage.interactive = true;

        this.id = window.location.hash.replace('#', '');

        this.onMessage = this.onMessage.bind(this);
        this.ws = new WebSocket(`ws://${window.location.hostname}:8999`);
        this.ws.addEventListener('message', this.onMessage);
    }

    init() {
        const [w, h] = [this.app.view.parentElement!.clientWidth, this.app.view.parentElement!.clientHeight];
        this.app.renderer.resize(w, h);
        this.app.stage.hitArea = this.app.renderer.screen;

        const gameField = new PIXI.Container();

        this.app.stage.addChild(gameField);

        const { scores, crowns } = this.setupScore(gameField);
        const { revealBorders, reveal } = this.setupReveal(gameField);

        this.graphics = {
            matchmaking: this.setupMatchmaking(),
            gameField,
            deck: this.setupDeck(gameField),
            hand: this.setupHand(gameField),
            rewardHolder: this.setupReward(gameField),
            revealBorders: [...revealBorders],
            reveal: [...reveal],
            scores: [...scores],
            crowns: [...crowns],
        };

        gameField.visible = false;

        this.recalcHand();
    }

    onMessage(e: MessageEvent) {
        const msg = JSON.parse(e.data) as ToClient;
        console.log({ msg });

        switch (msg.type) {
            case 'session_started': {
                console.log(this.status);
                if (this.status !== 'in_queue') {
                    break;
                }

                this.opponentId = msg.players.filter((p) => p !== this.id)[0];

                this.status = 'waiting';
                this.send({
                    type: 'my_deck',
                    cardIds: deck(),
                });
                break;
            }
            case 'turn_started': {
                if (this.status === 'waiting') {
                    this.graphics!.matchmaking.visible = false;
                    this.graphics!.gameField.visible = true;
                }

                this.status = 'turn_start';

                const holder = this.graphics!.rewardHolder;

                holder.removeChildren();

                console.log(msg.reward);

                const card = PIXI.Sprite.from(`game/card-r-${msg.reward}.png`);
                card.width = 168;
                card.height = 228;
                card.anchor.set(0.5);
                holder.addChild(card);

                const reveal = this.graphics!.reveal;
                const revealBorders = this.graphics!.revealBorders;

                reveal[0].removeChildren();

                reveal[1].removeChildren();

                revealBorders.forEach((b) => {
                    b.removeChildren();

                    const card = PIXI.Sprite.from('game/card-holder.png');

                    card.anchor.set(0.5);

                    b.addChild(card);
                });

                break;
            }
            case 'card_played': {
                if (this.status === 'turn_start' || this.status === 'turn_wait') {
                    const idx = msg.player === this.id ? 0 : 1;

                    const reveal = this.graphics!.reveal;
                    reveal[idx].removeChildren();

                    const card = PIXI.Sprite.from('game/card.png');
                    card.width = 168;
                    card.height = 228;
                    card.anchor.set(0.5);
                    reveal[idx].addChild(card);
                }

                break;
            }
            case 'turn_ended': {
                const mineValue = Number(msg.cards[this.id].replace('default', ''));
                const opponentValue = Number(msg.cards[this.opponentId!].replace('default', ''));
                const mine = msg.scores[this.id];
                const opponent = msg.scores[this.opponentId!];
                const scores = this.graphics!.scores;
                const crowns = this.graphics!.crowns;
                scores[0].text = mine.toString();
                scores[1].text = opponent.toString();

                if (mine > opponent) {
                    crowns[0].visible = true;
                    crowns[1].visible = false;
                } else if (mine < opponent) {
                    crowns[0].visible = false;
                    crowns[1].visible = true;
                } else {
                    crowns[0].visible = false;
                    crowns[1].visible = false;
                }

                const reveal = this.graphics!.reveal;

                reveal[0].removeChildren();
                reveal[1].removeChildren();

                const cardMine = PIXI.Sprite.from(`game/card-f-${mineValue}.png`);
                cardMine.width = 168;
                cardMine.height = 228;
                cardMine.anchor.set(0.5);
                reveal[0].addChild(cardMine);

                const cardOpponent = PIXI.Sprite.from(`game/card-f-${opponentValue}.png`);
                cardOpponent.width = 168;
                cardOpponent.height = 228;
                cardOpponent.anchor.set(0.5);
                reveal[1].addChild(cardOpponent);

                const revealBorders = this.graphics!.revealBorders;

                if (msg.winner === this.id) {
                    revealBorders[0].removeChildren();
                    const card = PIXI.Sprite.from('game/card-holder-red.png');

                    card.anchor.set(0.5);

                    revealBorders[0].addChild(card);
                } else if (msg.winner === this.opponentId!) {
                    revealBorders[1].removeChildren();
                    const card = PIXI.Sprite.from('game/card-holder-red.png');

                    card.anchor.set(0.5);

                    revealBorders[1].addChild(card);
                }

                this.status = 'turn_end';
                break;
            }
            case 'session_ended': {
                this.graphics!.gameField.visible = false;

                let winner = 0;

                if (msg.winner === this.id) {
                    winner = 1;
                } else if (msg.winner === this.opponentId!) {
                    winner = -1;
                }

                this.setupWinScreen(winner);

                this.status = 'match_end';

                break;
            }
        }
    }

    setupMatchmaking() {
        const matchmakingContainer = new PIXI.Container();
        const [centerX, centerY] = this.pos(0.5, 0.5);

        matchmakingContainer.x = centerX;
        matchmakingContainer.y = centerY;

        this.app.stage.addChild(matchmakingContainer);

        const [, h] = this.pos(0, 1);

        const circle = PIXI.Sprite.from('game/circle.png');
        circle.anchor.set(0.5);
        circle.y = -0.25 * h;
        matchmakingContainer.addChild(circle);

        const text = PIXI.Sprite.from('game/matchmaking-text.png');
        text.anchor.set(0.5);
        text.y = 0.1 * h;
        matchmakingContainer.addChild(text);

        const button = PIXI.Sprite.from('game/matchmaking-start.png');
        button.anchor.set(0.5);
        button.y = 0.275 * h;
        button.interactive = true;
        button.buttonMode = true;
        matchmakingContainer.addChild(button);

        button.on('pointerdown', () => {
            if (!this.ws.OPEN) {
                return;
            }

            matchmakingContainer.removeChild(button);

            const pressed = PIXI.Sprite.from('game/matchmaking-progress.png');

            pressed.anchor.set(0.5);
            pressed.y = 0.275 * h;
            matchmakingContainer.addChild(pressed);

            this.send({
                type: 'hello_msg',
                id: this.id,
            });
        });

        return matchmakingContainer;
    }

    setupDeck(container: PIXI.Container) {
        const deckPosition = this.pos(0.15 * 0.9, 0.35);
        const deck: PIXI.Sprite[] = [];
        for (let i = 0; i < 12; i++) {
            const card = PIXI.Sprite.from('game/card.png');

            card.anchor.set(0.5);

            let [x, y] = deckPosition;
            x -= i * 5;
            y -= i * 5;

            card.x = x;
            card.y = y;

            container.addChild(card);

            deck.push(card);
        }

        return deck;
    }

    setupReward(container: PIXI.Container) {
        const cardHolder = PIXI.Sprite.from('game/card-holder.png');

        cardHolder.anchor.set(0.5, 0.5);

        const [x, y] = this.pos(0.3, 0.35);

        cardHolder.x = x;
        cardHolder.y = y;

        container.addChild(cardHolder);

        const chest = PIXI.Sprite.from('game/chest.png');

        chest.anchor.set(0.5, 0.5);

        chest.y = -175;

        cardHolder.addChild(chest);

        return cardHolder;
    }

    setupReveal(container: PIXI.Container) {
        const revealContainer = new PIXI.Container();

        const [x, y] = this.pos(0.5, 0.35);

        revealContainer.x = x;
        revealContainer.y = y;
        revealContainer.rotation = -Math.PI / 2;

        container.addChild(revealContainer);

        const [, offset] = this.pos(0, 0.15);

        const cardMine = new PIXI.Container();
        cardMine.x = -offset;

        revealContainer.addChild(cardMine);

        const cardMineBorder = new PIXI.Container();
        cardMine.addChild(cardMineBorder);

        const cardMineSprite = PIXI.Sprite.from('game/card-holder.png');

        cardMineSprite.anchor.set(0.5);

        cardMineBorder.addChild(cardMineSprite);

        const cardMineCard = new PIXI.Container();
        cardMine.addChild(cardMineCard);

        const cardOpponent = new PIXI.Container();
        cardOpponent.x = offset;

        revealContainer.addChild(cardOpponent);

        const cardOpponentBorder = new PIXI.Container();
        cardOpponent.addChild(cardOpponentBorder);

        const cardOpponentSprite = PIXI.Sprite.from('game/card-holder.png');

        cardOpponentSprite.anchor.set(0.5);

        cardOpponentBorder.addChild(cardOpponentSprite);

        const cardOpponentCard = new PIXI.Container();
        cardOpponent.addChild(cardOpponentCard);

        return {
            revealBorders: [cardMineBorder, cardOpponentBorder],
            reveal: [cardMineCard, cardOpponentCard],
        } as const;
    }

    setupScore(container: PIXI.Container) {
        const scoreContainer = new PIXI.Container();

        const [x, y] = this.pos(0.75, 0.35);

        scoreContainer.x = x;
        scoreContainer.y = y;

        container.addChild(scoreContainer);

        const [, offset] = this.pos(0, 0.15);

        const myContainer = new PIXI.Container();

        myContainer.y = offset;

        scoreContainer.addChild(myContainer);

        const opponentContainer = new PIXI.Container();

        opponentContainer.y = -offset;

        scoreContainer.addChild(opponentContainer);

        const style = new PIXI.TextStyle({
            fontFamily: 'Abel',
            fontSize: 36,
            letterSpacing: 0.05 * 36,
        });

        const myTitle = new PIXI.Text('Your score:', style);
        myTitle.x = -200;
        myTitle.y = -75;
        myTitle.alpha = 0.25;
        myContainer.addChild(myTitle);

        const opponentTitle = new PIXI.Text('Opponent score:', style);
        opponentTitle.x = -200;
        opponentTitle.y = -75;
        opponentTitle.alpha = 0.25;
        opponentContainer.addChild(opponentTitle);

        const scoreStyle = new PIXI.TextStyle({
            fontFamily: 'Abel',
            fontSize: 96,
            letterSpacing: 0.05 * 96,
        });

        const myScore = new PIXI.Text('0', scoreStyle);
        myScore.x = -200;
        myScore.y = -25;
        myScore.alpha = 0.25;
        myContainer.addChild(myScore);

        const opponentScore = new PIXI.Text('0', scoreStyle);
        opponentScore.x = -200;
        opponentScore.y = -25;
        opponentScore.alpha = 0.25;
        opponentContainer.addChild(opponentScore);

        const myCrown = PIXI.Sprite.from('game/crown.png');
        myCrown.anchor.set(0.5);
        myCrown.x = 200;
        myContainer.addChild(myCrown);
        myCrown.visible = false;

        const opponentCrown = PIXI.Sprite.from('game/crown.png');
        opponentCrown.anchor.set(0.5);
        opponentCrown.x = 200;
        opponentContainer.addChild(opponentCrown);
        opponentCrown.visible = false;

        return {
            scores: [myScore, opponentScore],
            crowns: [myCrown, opponentCrown],
        } as const;
    }

    setupHand(container: PIXI.Container) {
        const hand: HandCard[] = [];
        for (let i = 1; i <= 12; i++) {
            const card = PIXI.Sprite.from(`game/card-f-${i}.png`) as HandCard;

            card.id = `default${i}`;
            card.value = i;

            card.anchor.set(0.5);

            card.width = 168;
            card.height = 228;

            container.addChild(card);

            hand.push(card);

            card.interactive = true;
            card.buttonMode = true;

            card.on('pointerdown', () => this.clickHand(i));

            const style = new PIXI.TextStyle({
                fontFamily: 'Abel',
                fontSize: 72,
                // stroke: '#ffffff',
                // strokeThickness: 0.5,
                letterSpacing: 0.05 * 72,
                align: 'center',
            });

            const richText = new PIXI.Text('Replace with an NFT.\nC’mon, it’s not that\nexpensive.', style);

            richText.anchor.set(0.5);

            const [x, y] = [0, 240];
            richText.x = x;
            richText.y = y;

            richText.alpha = 0.25;

            card.addChild(richText);
        }

        return hand;
    }

    clickHand(value: number) {
        if (this.status !== 'turn_start') {
            return;
        }

        const idx = this.graphics!.hand.findIndex((c) => c.value === value);
        const [card] = this.graphics!.hand.splice(idx, 1);

        card.destroy(true);

        this.app.stage.removeChild(card);

        this.recalcHand();

        this.send({
            type: 'play_card',
            id: card.id,
        });

        this.status = 'turn_wait';
    }

    recalcHand() {
        const handPosition = this.pos(0.5, 0.8);
        const [offset] = this.pos((1 / 12) * (1 - 0.15), 0);
        const start = handPosition[0] - offset * 0.5 * (this.graphics!.hand.length - 1);

        for (let i = 0; i < this.graphics!.hand.length; i++) {
            const card = this.graphics!.hand[i];

            card.x = start + offset * i;
            card.y = handPosition[1];
        }
    }

    setupWinScreen(result: number) {
        const selector = result === 1 ? 'win' : result === -1 ? 'loss' : 'draw';
        const winScreen = new PIXI.Container();

        const [centerX, centerY] = this.pos(0.5, 0.5);

        winScreen.x = centerX;
        winScreen.y = centerY;

        this.app.stage.addChild(winScreen);

        const winIcon = PIXI.Sprite.from(`game/${selector}-icon.png`);
        const [, iconY] = this.pos(0, 0.25);
        winIcon.anchor.set(0.5);
        winIcon.y = -iconY;
        winScreen.addChild(winIcon);

        const winTitle = PIXI.Sprite.from(`game/${selector}-title.png`);
        winTitle.anchor.set(0.5);
        winScreen.addChild(winTitle);

        const winSubtitle = PIXI.Sprite.from(`game/${selector}-subtitle.png`);
        winSubtitle.anchor.set(0.5);
        winSubtitle.y = 0.5 * iconY;
        winScreen.addChild(winSubtitle);

        const playAgain = PIXI.Sprite.from('game/play-again.png');
        playAgain.anchor.set(0.5);
        playAgain.y = 1.2 * iconY;
        playAgain.interactive = true;
        playAgain.buttonMode = true;
        playAgain.on('pointerdown', () => {
            localStorage.setItem('fromGame', 'true');
            window.location.reload();
        });
        winScreen.addChild(playAgain);
    }

    pos(x: number, y: number): [x: number, y: number] {
        return [x * this.app.screen.width, y * this.app.screen.height];
    }

    send(msg: ToServer | HelloMsg) {
        console.log('sending:');
        console.log({ msg });
        this.ws.send(JSON.stringify(msg));
    }
}

const allCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const deck = () => {
    return allCards.map((c) => `default${c}`);
};

export default Game;
