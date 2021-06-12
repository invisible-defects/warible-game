import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import Matchmaking from './matchmaking';
import Manager from './manager';

const manager = new Manager();
const matchmaking = new Matchmaking(manager);

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', ws => {
    matchmaking.enqueue(ws);
});

server.listen(8999, () => console.log("Server started"));
