import { ReponseTypeConstants } from "../Constants/MessageConstants";
import { ClientRequest, ClientResponse } from "../messageTypes";
import { BaseClass } from "./BaseService.ts";

export class ConfigService extends BaseClass {
    private boardSize!: number;
    private tilesToGen!: number;
    private timerInterval!: number;

    constructor(boardSize: number, tilesToGen: number, timerInterval: number) {
        super();
        this.setBoardSize(boardSize);
        this.setTilesToGen(tilesToGen);
        this.setTimerInterval(timerInterval);
    };

    public getBoardSize(): number {
        return this.boardSize;
    }

    public getTilesToGen(): number {
        return this.tilesToGen;
    }

    public getTimerInterval(): number {
        return this.timerInterval;
    }

    private setBoardSize(boardSize: number) {
        if (boardSize <= 1 || boardSize > 8) {
            this.loggingService.logMessage("");
        }
        this.boardSize = boardSize;
    }

    private setTilesToGen(count: number) {
        if (count < 1 || count > 8) {
            this.loggingService.logMessage("");
        }
        this.tilesToGen = count;
    }

    private setTimerInterval(time: number) {
        if (time <= 3 || time > 60) {
            this.loggingService.logMessage("");
        }
        this.timerInterval = time;
    }

    public setConfigs(boardSize: number, tilesToGen: number, timerInterval: number) {
        this.setBoardSize(boardSize);
        this.setTilesToGen(tilesToGen);
        this.setTimerInterval(timerInterval);
    }

    public createResponse(request: ClientRequest, data?: string): ClientResponse {
        return this.createClientResponse(ReponseTypeConstants.UPDATED_CONFIG, request, data ?? JSON.stringify({ boardSize: this.boardSize, tilesToGen: this.tilesToGen, timerInterval: this.timerInterval }));
    }
}