import WebSocket from 'ws';
import Session from './session';
import Player from './player';

class Manager {
    private sessions: Session[] = [];

    startSession(players: [Player, Player]) {
        const session = new Session(players);
        this.sessions.push(session);
    }
}

export default Manager;
