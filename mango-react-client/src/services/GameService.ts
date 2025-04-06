import { TileService } from "./TilesService";
import { BoardService } from "./BoardService";
import { ConfigService } from "./ConfigService";
import { TimerService } from "./TimerService";

export class GameService {
    private tileService!: TileService;
    private boardService!: BoardService;
    private configService!: ConfigService;
    private timerService!: TimerService;

    private online: boolean = false;

    private static instance: GameService;

    private constructor() {
        this.configService = new ConfigService();
        this.tileService = new TileService(this.configService);
        this.boardService = new BoardService(this.configService);
        this.timerService = new TimerService(this.configService.getTimerInterval(), () => this.tileService.addTiles(true));
    }

    public static getInstance() {
        if(!GameService.instance){
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
}