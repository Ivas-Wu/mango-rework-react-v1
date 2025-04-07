import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';
import { SessionMessage } from '../types';
import { MessageTypeConstants } from '../Constants/requestConstants';

const clientMap = new Map<string, WebSocket>();
const redisPub = createClient();
const redisSub = createClient();

export function handleClientConnection(ws: WebSocket) {
    const clientId = uuidv4();
    clientMap.set(clientId, ws);

    ws.send(JSON.stringify({ clientId, message: 'Connected' }));

    ws.on('message', (raw) => {
        try {
            const msg = JSON.parse(raw.toString()) as Partial<SessionMessage>;
            let sessionId: string;
            if (msg.type === MessageTypeConstants.CREATE_SESSION) {
                sessionId = generateUniqueCode();
                ws.send(JSON.stringify({ message: 'Session created.', sessionId }));
            }
            else if (msg.type === MessageTypeConstants.JOIN_SESSION && msg.session) {
                sessionId = msg.session;
                const requestId = uuidv4();
                const sessionMsg: SessionMessage = {
                    type: msg.type,
                    session: sessionId,
                    clientId,
                    requestId,
                };

                redisPub.publish(`session:${sessionId}`, JSON.stringify(sessionMsg));
            }
            else {
                ws.send(JSON.stringify({ message: 'Invalid message type.'}));
            }
        } catch (err) {
            console.error('Bad message format', err);
        }
    });

    ws.on('close', () => {
        clientMap.delete(clientId);
    });
}

export async function initRedis() {
    await redisPub.connect();
    await redisSub.connect();
}

export function setRedisCallback() {
    redisSub.pSubscribe('sessionResponse:*', (raw) => {
        const msg: SessionMessage = JSON.parse(raw);
        const client = clientMap.get(msg.clientId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ requestId: msg.requestId, number: msg.number }));
        }
    });
}

function generateUniqueCode(): string {
    const existingCodes = Array.from(clientMap.keys()); // Assuming client IDs are the codes
    let code: string;
    do {
        code = Math.random().toString(36).substring(2, 6).toUpperCase(); // Generate a random 4-char code
    } while (existingCodes.includes(code));
    return code;
}