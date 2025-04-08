import { TileService } from "./TileService.ts";
// import { BoardService } from "./BoardService";
import { ConfigService } from "./ConfigService.ts";
import { ClientRequest, ClientResponse } from "../types";
// import { TimerService } from "./TimerService";

export class GameService {
    private tileService!: TileService;
    // private boardService!: BoardService;
    private configService!: ConfigService;
    // private timerService!: TimerService;
    private number = Math.random() * 100;

    constructor(boardSize: number, tilesToGen: number, timerInterval: number) {
        this.configService = new ConfigService(boardSize, tilesToGen, timerInterval);
        this.tileService = new TileService(this.configService);
        // this.boardService = new BoardService(this.configService);
        // this.timerService = new TimerService(this.configService.getTimerInterval(), () => this.tileService.addTiles(true));
    }

    public testStub(request: ClientRequest): ClientResponse {
        const response: ClientResponse = {
            clientId: request.clientId,
            requestId: request.requestId,
            session: request.session,
            data: request.session,
        }
        return response;
    }

    public handleTileRequest(request: ClientRequest): ClientResponse {
        const response: ClientResponse = {
            clientId: request.clientId,
            requestId: request.requestId,
            session: request.session,
            data: JSON.stringify({ number: this.number }),
        }
        return response;
    }

    // public getBoardService(): BoardService {
    //     return this.boardService;
    // }

    public getConfigService(): ConfigService {
        return this.configService;
    }

    // public getTimerService(): TimerService {
    //     return this.timerService;
    // }
}