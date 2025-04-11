import EventEmitter from "events";
import { ConfigBroadcastConstants } from "../../constants/EventConstants";

export abstract class ConfigService {
    protected boardSize!: number;
    protected tilesToGen!: number;
    protected timerInterval!: number;

    protected timerMode!: boolean;
    protected canPause!: boolean;

    protected eventHandler!: EventEmitter;

    constructor() {
        this.eventHandler = new EventEmitter();
    };

    protected broadCastConfigUpdated(): void {
        this.eventHandler.emit(ConfigBroadcastConstants.CONFIGS_UPDATED, this.boardSize);
    }

    public getBoardSize(): number {
        return this.boardSize;
    }

    public getTilesToGen(): number {
        return this.tilesToGen;
    }

    public getTimerMode(): boolean {
        return this.timerMode;
    }

    public getCanPause(): boolean {
        return this.canPause;
    }

    public getTimerInterval(): number {
        return this.timerInterval;
    }

    public on(event: ConfigBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }

    public abstract save(boardSize: number, tilesToGen: number, timerMode: boolean, canPause: boolean, timerInterval: number): void;
}