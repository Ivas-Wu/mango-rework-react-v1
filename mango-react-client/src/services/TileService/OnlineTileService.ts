import { Operator } from '../../components/Tiles/TileModels';
import { ClientRequest, MessageClassConstants, MessageTypeConstants } from '../../constants/MessageTypes';
import { TileService } from './TileService';

export class OnlineTileService extends TileService {
    private socket!: WebSocket;
    private sessionId!: string;

    constructor(wsURL: string, sessionId: string) {
        super();
        this.sessionId = sessionId;
        this.socket = new WebSocket(wsURL);
        // Event: Connection opened
        this.socket.onopen = (event: Event) => {
            console.log("WebSocket connection opened:", event);
        };

        this.socket.onmessage = (event: MessageEvent) => {
            console.log("Message from server:", event.data);
            try {
                const message = JSON.parse(event.data);
                console.log("Parsed message:", message);
            } catch (e) {
                console.warn("Failed to parse message as JSON:", event.data);
            }
        };

        // Event: Error occurred
        this.socket.onerror = (event: Event) => {
            console.error("WebSocket error:", event);
        };

        // Event: Connection closed
        this.socket.onclose = (event: CloseEvent) => {
            console.log("WebSocket connection closed:", event);
        };
    }

    protected reset(): void {
        this.broadCastTilesUpdated();
    }

    public addTiles(fromTimer: boolean = false): void {
        // never need to add tiles but need this stub
    }

    public clearTile(idx: number): void {
        const request: ClientRequest = {
            class: MessageClassConstants.TILE,
            type: MessageTypeConstants.CLEAR_TILE,
            session: this.sessionId,
            data: JSON.stringify({ idx }),
        }
        this.socket.send(JSON.stringify(request));
        this.broadCastTilesUpdated();
    }

    public basicOperation(idx1: number, idx2: number, operator: Operator): void {
        this.broadCastTilesUpdated(true);
    }

    public setTileUsed(idx: number): void {
        this.broadCastTilesUpdated();
    }
}
