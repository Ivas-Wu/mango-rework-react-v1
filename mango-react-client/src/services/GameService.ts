import { TileService } from "./TileService/TileService";
import { OfflineTileService } from "./TileService/OfflineTileService";
import { OnlineTileService } from "./TileService/OnlineTileService";

import { BoardService } from "./BoardService";
import { ConfigService } from "./ConfigService/ConfigService";
import { TimerService } from "./TimerService";
import { ControlsService } from "./ControlsService";
import { WebsocketService } from "./WebsocketService";
import { OfflineConfigService } from "./ConfigService/OfflineConfigService";
import { OnlineConfigService } from "./ConfigService/OnlineConfigService";

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
            this.configService = new OnlineConfigService(this.wsService, 4, 3, 15);
            this.tileService = new OnlineTileService(this.wsService);
        }
        else {
            this.configService = new OfflineConfigService();
            this.tileService = new OfflineTileService(this.configService);
        }
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