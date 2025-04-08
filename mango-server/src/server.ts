import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { initializeSessionManager } from './sessionManager.ts';
import { handleClientConnection, initRedis, setRedisCallback } from './Logic/serverLogic.ts';


const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
initializeSessionManager() // can be seperated out into its own service in future to scale independantly
// setup redis
await initRedis();
setRedisCallback();

// On connection
wss.on('connection', (ws: WebSocket) => {
    handleClientConnection(ws);
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});