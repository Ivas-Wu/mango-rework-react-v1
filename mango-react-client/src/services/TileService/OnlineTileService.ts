import { Operator } from '../../components/Tiles/TileModels';
import { ClientResponse, MessageClassConstants, MessageTypeConstants, ReponseTypeConstants } from '../../constants/MessageTypes';
import { WebsocketService } from '../WebsocketService';
import { TileService } from './TileService';

export class OnlineTileService extends TileService {
    private wsService!: WebsocketService;

    constructor(wsService: WebsocketService) {
        super();
        this.wsService = wsService;
        this.wsService.addEventListener(ReponseTypeConstants.UPDATED_TILES, this.handleResponse.bind(this));
    }

    private handleResponse(message: ClientResponse) {
        console.log("testing: ", message);
        if (!message.data) return;
        const data: any = JSON.parse(message.data);
        this.basicTiles = data.basicTiles;
        this.advancedTiles = data.advancedTiles;
        this.broadCastTilesUpdated(data.selectLatest);
    }

    private sendRequest(type: MessageTypeConstants, data? : string): void {
        this.wsService.sendRequest(MessageClassConstants.TILE, type, data);
    }

    public addTiles(fromTimer: boolean = false): void { //For testing only
        this.wsService.sendRequest(MessageClassConstants.GAME, MessageTypeConstants.GAME_START);
    }

    public clearTile(idx: number): void {
        this.sendRequest(MessageTypeConstants.CLEAR_TILE, JSON.stringify({ idx }));
    }

    public basicOperation(idx1: number, idx2: number, operator: Operator): void {
        this.sendRequest(MessageTypeConstants.OPERATION_TILE, JSON.stringify({ idx1, idx2, operator }));
    }

    public setTileUsed(idx: number): void {
        this.sendRequest(MessageTypeConstants.SET_TILE, JSON.stringify({ idx }));
    }
}
