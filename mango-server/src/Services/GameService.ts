import { TileService } from "./TileService.ts";
// import { BoardService } from "./BoardService";
import { ConfigService } from "./ConfigService.ts";
import { ClientRequest, ClientResponse } from "../messageTypes.ts";
import { TimerService } from "./TimerService.ts";
import { TileBroadcastConstants } from "../Constants/TileConstants.ts";
import { ReponseTypeConstants } from "../Constants/MessageConstants.ts";
import { BaseClass } from "./BaseService.ts";
import { json } from "stream/consumers";

export class GameService extends BaseClass{
    private tileService!: TileService;
    // private boardService!: BoardService;
    private configService!: ConfigService;
    private timerService!: TimerService;
    private sessionId!: string;

    constructor(boardSize: number, tilesToGen: number, timerInterval: number) {
        super();
        this.configService = new ConfigService(boardSize, tilesToGen, timerInterval);
        this.tileService = new TileService(this.configService);
        // this.boardService = new BoardService(this.configService);
        this.timerService = new TimerService(this.configService.getTimerInterval(), () => this.tileService.generateBasicTiles());
    }

    //#region SETUP
    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    public setupTileServiceCallback(callback: () => void) {    
        this.tileService.on(TileBroadcastConstants.TILE_ADDED, callback);
    }
    //#endregion
    
    //#region GAME ACTIONS
    private createResponse(request: ClientRequest, data: string): ClientResponse {
        return this.createClientResponse(ReponseTypeConstants.GAME_STATUS, request, data);
    }

    public startGame(request: ClientRequest): ClientResponse {
        this.timerService.startTimer();
        return this.createResponse(request, JSON.stringify({ message: "Game started" }))
    }

    public stopGame(request: ClientRequest): ClientResponse {
        this.timerService.stopTimer();
        return this.createResponse(request, JSON.stringify({ message: "Game ended" }))
    }

    public addClient(clientId: string) {
        this.tileService.addClient(clientId);
    }

    public removeClient(clientId: string) {
        this.tileService.removeClient(clientId);
    }
    //#endregion
    
    //#region CREATE RESPONSES
    public getClientTilesResponse(request: ClientRequest, selectLatest: boolean = false): ClientResponse {
        return this.tileService.createResponse(request, selectLatest);
    }

    public getConfigReponse(request: ClientRequest): ClientResponse  {
        return this.configService.createResponse(request);
    }
    //#endregion
    
    //#region TILE ACTIONS
    public getAllTiles(): ClientResponse[] {
        return this.tileService.getAllClientTiles(this.sessionId);
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
    //#endregion

    //#region  CONFIG ACTIONS
    public setConfigs(request: ClientRequest): void {
        if (!request.data) return;
        const data: any = JSON.parse(request.data);
        this.configService.setConfigs(data.boardSize, data.tilesToGen, data.timerInterval);
        this.timerService.setInterval(data.timerInterval); // Can update timer and number service to inject config service and bypass need to update
        this.tileService.updateNumberService(data.boardSize);
    }
    //#endregion
}