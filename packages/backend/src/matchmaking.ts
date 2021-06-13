import WebSocket from 'ws';

import { HelloMsg, isHelloMsg } from 'common';

import Manager from './manager';
import Player from './player';

class Matchmaking {
    private manager: Manager;
    private queued: Player[] = [];
    private callback: (this: WebSocket, data: WebSocket.Data) => void;

    constructor(manager: Manager) {
        this.manager = manager;
        const mm = this;
        this.callback = function (this: WebSocket, data: WebSocket.Data) {
            mm.onMessage(this, data);
        };
    }

    enqueue(ws: WebSocket) {
        ws.on('message', this.callback);
    }

    onMessage(ws: WebSocket, data: WebSocket.Data) {
        try {
            const message = JSON.parse(data as string);

            console.log({ message });

            if (isHelloMsg(message)) {
                const player: Player = {
                    id: message.id,
                    ws,
                };

                ws.off('message', this.callback);

                this.queued.push(player);
                this.update();
            }
        } catch (error) {
            console.log('Ошибка', error);
        }
    }

    update() {
        if (this.queued.length >= 2) {
            const p1 = this.queued.shift()!;
            const p2 = this.queued.shift()!;

            console.log(`starting session with ${p1.id} and ${p2.id}`);
            this.manager.startSession([p1, p2]);
        }
    }
}

export default Matchmaking;
