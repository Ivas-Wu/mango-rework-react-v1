import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';
import { ClientRequest, ClientResponse } from '../messageTypes.ts';
import { MessageClassConstants, MessageTypeConstants } from '../Constants/MessageConstants.ts';

const clientMap = new Map<string, WebSocket>();
const sessionMap = new Map<string, number>();

const redisPub = createClient();
const redisSub = createClient();

export function handleClientConnection(ws: WebSocket) {
    const clientId = uuidv4(); // generate random client Id
    clientMap.set(clientId, ws); // map the client id to the websocket it is connected on

    onConnect(ws, clientId);
    ws.on('message', (raw) => onMessage(ws, clientId, raw));
    ws.on('close', onClose);
}

export async function initRedis() {
    await redisPub.connect();
    await redisSub.connect();
    redisSub.pSubscribe('sessionResponse:*', (raw) => sessionResponse(raw));
}

function generateUniqueCode(): string {
    let code: string;
    do {
        code = Math.random().toString(36).substring(2, 6).toUpperCase();
    } while (sessionMap.get(code) != undefined);
    return code;
}

function sendClient(ws: WebSocket, message: any) {
    ws.send(JSON.stringify(message));
}

function logMessage(message: string) { //extract to service at somepoint
    console.log(message);
}

function publishRedisMessage(key: string, message: string) { //extract to service at somepoint
    redisPub.publish(key, message);
}

function onConnect(ws: WebSocket, clientId: string) {
    sendClient(ws, { clientId, message: 'Connected' });
}

function onMessage(ws: WebSocket, clientId: string, rawData: any) {
    try {
        const msg = JSON.parse(rawData.toString()) as Partial<ClientRequest>;
        switch (msg.class) {
            case MessageClassConstants.CONNECTION:
                if (msg.type === MessageTypeConstants.CREATE_SESSION) {
                    sendClient(ws, { sessionId: generateUniqueCode(), message: 'Session created' });
                }
                break;
            default:
                publishRedisMessage(`session:${msg.session}`, JSON.stringify(createClientRequest(msg, clientId)));
        }
    } catch (err) {
        console.error('Bad message format', err);
    }
}

function onClose(clientId: string) {
    clientMap.delete(clientId);
    logMessage(`Disconnected. Client: ${clientId}`);
}

function sessionResponse(message: string) {
    const msg: ClientResponse = JSON.parse(message);
    const client = clientMap.get(msg.clientId);
    if (client) {
        if (client.readyState === WebSocket.OPEN) sendClient(client, message);
        // If the client is no longer connected, remove it from the lookup and ensure it is cleaned out of the session workers
        else if (client.readyState > WebSocket.OPEN) {
            clientMap.delete(msg.clientId);
            const serverRequest: ClientRequest = {
                class: MessageClassConstants.SERVER,
                type: MessageTypeConstants.DELETE_CLIENT,
                requestId: '', //TODO
                session: msg.session!,
                clientId: msg.clientId,
            };
            publishRedisMessage(`session:${msg.session}`, JSON.stringify(serverRequest));
        }
    }
}

function createClientRequest(message: Partial<ClientRequest>, clientId: string): ClientRequest {
    const requestId = uuidv4();
    const clientRequest: ClientRequest = {
        class: message.class!,
        type: message.type!,
        session: message.session!,
        clientId: clientId,
        requestId,
        data: message.data
    };
    return clientRequest;
}