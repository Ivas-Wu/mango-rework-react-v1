import { MessageClassConstants, MessageTypeConstants, ReponseTypeConstants } from "../Constants/MessageConstants";
import { ClientRequest, ClientResponse } from "../messageTypes";
import { GameService } from "../Services/GameService.ts";

export const gameService = new GameService(3, 3, 15);
let once = false;

export function handleClientMessage(message: ClientRequest): string {
    if (!once) {
        gameService.setSessionId(message.session);
        once = true;
    }

    let response: ClientResponse;
    switch (message.class) {
        case MessageClassConstants.SERVER:
            response = handleServerMessage(message);
            break;
        case MessageClassConstants.CONNECTION:
            response = handleConnectionMessage(message);
            break;
        case MessageClassConstants.GAME:
            response = handleGameMessage(message);
            break;
        case MessageClassConstants.TILE:
            response = handleTileMessage(message);
            break;
        case MessageClassConstants.BOARD:
            response = handleBoardMessage(message);
            break;
        case MessageClassConstants.CONFIG:
            response = handleConfigMessage(message);
            break;
        default:
            throw Error();
    }

    return JSON.stringify(response);
}

function handleServerMessage(message: ClientRequest): ClientResponse {
    let response: ClientResponse;
    switch (message.type) {
        case MessageTypeConstants.DELETE_CLIENT:
            response = {
                type: ReponseTypeConstants.CONNECTION_STATUS,
                clientId: message.clientId,
                requestId: message.requestId,
                session: message.session,
                data: JSON.stringify({ message: 'Disconnected, client removed', sessionId: message.session }),
            }
            gameService.removeClient(message.clientId);
            break;
        default:
            throw Error();
    }
    return response;
}

function handleConnectionMessage(message: ClientRequest): ClientResponse {
    let response: ClientResponse;
    switch (message.type) {
        case MessageTypeConstants.JOIN_SESSION:
            response = {
                type: ReponseTypeConstants.CONNECTION_STATUS,
                clientId: message.clientId,
                requestId: message.requestId,
                session: message.session,
                data: JSON.stringify({ message: 'Connected to session', sessionId: message.session }),
            }
            gameService.addClient(message.clientId);
            break;
        default:
            throw Error();
    }
    return response;
}

function handleGameMessage(message: ClientRequest): ClientResponse {
    switch (message.type) {
        case MessageTypeConstants.GAME_START:
            return gameService.startGame(message);
        default:
            throw Error();
    }
}

function handleTileMessage(message: ClientRequest): ClientResponse {
    switch (message.type) {
        case MessageTypeConstants.GET_TILE: //Should only be used for desyncs and debugging
            break;
        case MessageTypeConstants.CLEAR_TILE:
            gameService.clearTile(message);
            break;
        case MessageTypeConstants.SET_TILE:
            gameService.setTile(message);
            break;
        case MessageTypeConstants.OPERATION_TILE:
            gameService.basicTileOperation(message);
            break;
        default:
            throw Error();
    }
    return gameService.getClientTiles(message);
}

function handleBoardMessage(message: ClientRequest): ClientResponse {
    let response: ClientResponse;
    switch (message.type) {
        case MessageTypeConstants.JOIN_SESSION:
            response = gameService.getClientTiles(message);
            break;
        default:
            throw Error();
    }
    return response;
}

function handleConfigMessage(message: ClientRequest): ClientResponse {
    let response: ClientResponse;
    switch (message.type) {
        case MessageTypeConstants.JOIN_SESSION:
            response = gameService.getClientTiles(message);
            break;
        default:
            throw Error();
    }
    return response;
}
