import { parentPort } from 'worker_threads';
import { GameService } from './Services/GameService.ts';
import { MessageTypeConstants } from './Constants/requestConstants.ts';

const gameService = new GameService(3, 3, 15);

parentPort?.on('message', (raw) => {
    const msg = JSON.parse(raw);
    let response;
    switch (msg.type) {
        case MessageTypeConstants.TILE:
            response = gameService.handleTileRequest(msg);
            break;
        case MessageTypeConstants.JOIN_SESSION:
            response = gameService.testStub(msg);
            break;
        default:
            throw Error()
    }
    
    parentPort?.postMessage(JSON.stringify(response));
})

console.log(`Session worker is running`);
