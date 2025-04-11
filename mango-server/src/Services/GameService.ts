import { TileService } from "./TileService.ts";
// import { BoardService } from "./BoardService";
import { ConfigService } from "./ConfigService.ts";
import { ClientRequest, ClientResponse } from "../messageTypes.ts";
import { TimerService } from "./TimerService.ts";
import { TileBroadcastConstants } from "../Constants/TileConstants.ts";
import { ReponseTypeConstants } from "../Constants/MessageConstants.ts";

export class GameService {
    private tileService!: TileService;
    // private boardService!: BoardService;
    private configService!: ConfigService;
    private timerService!: TimerService;
    private sessionId!: string;

    constructor(boardSize: number, tilesToGen: number, timerInterval: number) {
        this.configService = new ConfigService(boardSize, tilesToGen, timerInterval);
        this.tileService = new TileService(this.configService);
        // this.boardService = new BoardService(this.configService);
        this.timerService = new TimerService(this.configService.getTimerInterval(), () => this.tileService.generateBasicTiles());
    }

    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    public setupTileServiceCallback(callback: () => void) {    
        this.tileService.on(TileBroadcastConstants.TILE_ADDED, callback);
    }

    public startGame(request: ClientRequest): ClientResponse {
        this.timerService.startTimer();
        const response: ClientResponse = {
            type: ReponseTypeConstants.GAME_STATUS,
            clientId: request.clientId,
            requestId: request.requestId,
            session: request.session,
            data: JSON.stringify({ message: "Game started" }),
        }
        return response;
    }

    public stopGame(request: ClientRequest): ClientResponse {
        this.timerService.stopTimer();
        const response: ClientResponse = {
            type: ReponseTypeConstants.GAME_STATUS,
            clientId: request.clientId,
            requestId: request.requestId,
            session: request.session,
            data: JSON.stringify({ message: "Game ended" }),
        }
        return response;
    }

    public addClient(clientId: string) {
        this.tileService.addClient(clientId);
    }

    public removeClient(clientId: string) {
        this.tileService.removeClient(clientId);
    }

    public getAllTiles(): ClientResponse[] {
        let responses: ClientResponse[] = [];
        const tileMap: Map<string, any> = this.tileService.getAllTiles();
        tileMap.forEach((value, key) => {
            let response: ClientResponse = {
                type: ReponseTypeConstants.UPDATED_TILES,
                clientId: key,
                session: this.sessionId,
                data: JSON.stringify(value),
            }
            responses.push(response);
        });
        return responses;
    }

    public getClientTiles(request: ClientRequest, selectLatest: boolean = false): ClientResponse {
        return this.tileService.getClientTiles(request, selectLatest);
    }

    public clearTile(request: ClientRequest): void {
        if (!request.data) return;

        const data = JSON.parse(request.data);

        if (!data.idx) return;

        this.tileService.clearTile(data.idx, request.clientId);
        // find board tile and clear TODO
    }

    public setTile(request: ClientRequest): void {
        if (!request.data) return;

        const data = JSON.parse(request.data);

        if (!data.idx) return;

        this.tileService.setTileUsed(data.idx, request.clientId);
        // find board tile and set
    }

    public basicTileOperation(request: ClientRequest): void {
        if (!request.data) return;

        const data = JSON.parse(request.data);

        if (data.idx1 === undefined || data.idx2 === undefined || data.operator === undefined) return;

        this.tileService.basicOperation(data.idx1, data.idx2, data.operator, request.clientId);
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