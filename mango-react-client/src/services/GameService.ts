import { TileService } from "./TileService/TileService";
import { BoardService } from "./BoardService";
import { ConfigService } from "./ConfigService";
import { TimerService } from "./TimerService";
import { OfflineTileService } from "./TileService/OfflineTileService";
import { ControlsService } from "./ControlsService";
import { OnlineTileService } from "./TileService/OnlineTileService";
import { WebsocketService } from "./WebsocketService";

export class GameService {
    private tileService!: TileService;
    private boardService!: BoardService;
    private configService!: ConfigService;
    private timerService!: TimerService;
    private controlsService: ControlsService
    private wsService: WebsocketService | null = null;

    private online: boolean = true;

    private static instance: GameService;

    private constructor() {
        if (this.online) {
            this.wsService = new WebsocketService();
            this.tileService = new OnlineTileService(this.wsService);
        }
        else {
            this.tileService = new OfflineTileService(this.configService);
        }
        this.configService = new ConfigService();
        this.boardService = new BoardService(this.configService);
        this.timerService = new TimerService(this.configService.getTimerInterval(), () => this.tileService.addTiles(true));
        this.controlsService = ControlsService.getInstance();
    }

    public static getInstance() {
        if (!GameService.instance) {
            GameService.instance = new GameService();
        }
        return GameService.instance;
    }

    public getTileService(): TileService {
        return this.tileService;
    }

    public getBoardService(): BoardService {
        return this.boardService;
    }

    public getConfigService(): ConfigService {
        return this.configService;
    }

    public getTimerService(): TimerService {
        return this.timerService;
    }

    public getControlsService(): ControlsService {
        return this.controlsService;
    }
}