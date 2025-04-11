import { ClientResponse, MessageClassConstants, MessageTypeConstants, ReponseTypeConstants } from "../../constants/MessageTypes";
import { WebsocketService } from "../WebsocketService";
import { ConfigService } from "./ConfigService";

export class OnlineConfigService extends ConfigService {
    private wsService!: WebsocketService;

    constructor(wsService: WebsocketService, boardSize: number, tilesToGen: number, timerInterval: number) {
        super();
        this.wsService = wsService;
        this.boardSize = boardSize;
        this.tilesToGen = tilesToGen;
        this.timerInterval = timerInterval;
        this.timerMode = true;
        this.canPause = false;
        this.wsService.addEventListener(ReponseTypeConstants.UPDATED_CONFIG, this.handleResponse.bind(this));
    }

    private handleResponse(message: ClientResponse) {
        console.log("testing: ", message);
        if (!message.data) return;
        const data: any = JSON.parse(message.data);
        this.boardSize = data.boardSize;
        this.tilesToGen = data.tilesToGen;
        this.timerInterval = data.timerInterval;
        this.broadCastConfigUpdated();
    }

    private sendRequest(type: MessageTypeConstants, data?: string): void {
        this.wsService.sendRequest(MessageClassConstants.CONFIG, type, data);
    }

    public save(boardSize: number, tilesToGen: number, timerMode: boolean, canPause: boolean, timerInterval: number) {
        this.sendRequest(MessageTypeConstants.SET_CONFIGS, JSON.stringify({ boardSize, tilesToGen, timerInterval }));
    }
}