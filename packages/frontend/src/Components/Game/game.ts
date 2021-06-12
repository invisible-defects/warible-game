import * as PIXI from 'pixi.js';

interface HandCard extends PIXI.Sprite {
    id: string;
    value: number;
}

interface GameData {
    deck: PIXI.Sprite[];
    hand: HandCard[];
}

class Game {
    app: PIXI.Application;

    data?: GameData;

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
    }

    init() {
        const [w, h] = [this.app.view.parentElement!.clientWidth, this.app.view.parentElement!.clientHeight];
        this.app.renderer.resize(w, h);
        this.app.stage.hitArea = this.app.renderer.screen;

        this.data = {
            deck: [],
            hand: [],
        };

        this.setupDeck();
        this.setupHand();
    }

    setupDeck() {
        const deckPosition = this.pos(0.15 * 0.9, 0.3);
        for (let i = 0; i < 12; i++) {
            const card = PIXI.Sprite.from('game/card.png');

            card.anchor.set(0.5);

            let [x, y] = deckPosition;
            x -= i * 5;
            y -= i * 5;

            card.x = x;
            card.y = y;

            this.app.stage.addChild(card);

            this.data!.deck.push(card);
        }
    }

    setupHand() {
        for (let i = 1; i <= 12; i++) {
            let card = PIXI.Sprite.from(`game/card-f-${i}.png`) as HandCard;

            card.id = `default${i}`;
            card.value = i;

            card.anchor.set(0.5);

            card.width = 168;
            card.height = 228;

            this.app.stage.addChild(card);

            this.data!.hand.push(card);

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

        this.recalcHand();
    }

    clickHand(value: number) {
        const idx = this.data!.hand.findIndex((c) => c.value === value);
        const [card] = this.data!.hand.splice(idx, 1);

        card.destroy(true);

        this.app.stage.removeChild(card);

        this.recalcHand();
    }

    recalcHand() {
        const handPosition = this.pos(0.5, 0.8);
        const [offset] = this.pos((1 / 12) * (1 - 0.15), 0);
        const start = handPosition[0] - offset * 0.5 * (this.data!.hand.length - 1);

        for (let i = 0; i < this.data!.hand.length; i++) {
            const card = this.data!.hand[i];

            card.x = start + offset * i;
            card.y = handPosition[1];
        }
    }

    pos(x: number, y: number): [x: number, y: number] {
        return [x * this.app.screen.width, y * this.app.screen.height];
    }
}

export default Game;
