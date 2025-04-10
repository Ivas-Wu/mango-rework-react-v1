import { parentPort } from 'worker_threads';
import { handleClientMessage, gameService } from './Logic/sessionLogic.ts';
import { ClientResponse } from './messageTypes.ts';

parentPort?.on('message', (raw) => {
    parentPort?.postMessage(handleClientMessage(JSON.parse(raw)));
})

gameService.setupTileServiceCallback(() => {
    const tileSets: ClientResponse[] = gameService.getAllTiles();
    for (const tileSet of tileSets) {
        parentPort?.postMessage(JSON.stringify(tileSet));
    };
})

console.log(`Session worker is running`);
