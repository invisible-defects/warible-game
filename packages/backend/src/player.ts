import WebSocket from 'ws';

interface Player {
    id: string;
    ws: WebSocket;
}

export default Player;
