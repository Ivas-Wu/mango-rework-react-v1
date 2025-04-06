import EventEmitter from "events";
import { ConfigDefaults } from "../constants/Defaults";
import { ConfigBroadcastConstants } from "../constants/EventConstants";
import { ConfigConstants } from "../constants/StorageDefaults";

export class ConfigService {
    private boardSize!: number;
    private tilesToGen!: number;

    private timerMode!: boolean;
    private canPause!: boolean;
    private timerInterval!: number;

    private eventHandler!: EventEmitter;

    constructor() {
        this.eventHandler = new EventEmitter();

        this.setBoardSize(Number(this.getStorageValue(ConfigConstants.BOARD_SIZE)) || ConfigDefaults.BOARD_SIZE);
        this.setTilesToGen(Number(this.getStorageValue(ConfigConstants.TILES_TO_GEN)) || ConfigDefaults.TILES_TO_GEN);
        this.setTimerMode(this.getStorageValue(ConfigConstants.TIMER_MODE)?.toLowerCase() === 'true' || ConfigDefaults.TIMER_MODE);
        this.setCanPause(this.getStorageValue(ConfigConstants.CAN_PAUSE) ? this.getStorageValue(ConfigConstants.CAN_PAUSE)!.toLowerCase() === 'true' : ConfigDefaults.CAN_PAUSE);
        this.setTimerInterval(Number(this.getStorageValue(ConfigConstants.TIMER_INTERVAL)) || ConfigDefaults.INTERVAL);
    };

    private getStorageValue(key: ConfigConstants) {
        return localStorage.getItem(key);
    }

    private setStorageValue(key: ConfigConstants, value: any) {
        localStorage.setItem(key, String(value));
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

    private setBoardSize(boardSize: number) {
        if (boardSize <= 1 || boardSize > 8) boardSize = ConfigDefaults.BOARD_SIZE
        this.setStorageValue(ConfigConstants.BOARD_SIZE, boardSize);
        this.boardSize = boardSize;
    }

    private setTilesToGen(count: number) {
        if (count < 1 || count > 8) count = ConfigDefaults.TILES_TO_GEN
        this.setStorageValue(ConfigConstants.TILES_TO_GEN, count);
        this.tilesToGen = count;
    }

    private setTimerMode(set: boolean) {
        this.setStorageValue(ConfigConstants.TIMER_MODE, set);
        this.timerMode = set;
    }

    private setCanPause(pause: boolean) {
        this.setStorageValue(ConfigConstants.CAN_PAUSE, pause);
        this.canPause = pause;
    }

    private setTimerInterval(time: number) {
        if (time <= 3 || time > 60) time = ConfigDefaults.INTERVAL
        this.setStorageValue(ConfigConstants.TIMER_INTERVAL, time);
        this.timerInterval = time;
    }

    public on(event: ConfigBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }

    public save(boardSize: number, tilesToGen: number, timerMode: boolean, canPause: boolean, timerInterval: number) {
        this.setBoardSize(boardSize);
        this.setTilesToGen(tilesToGen);
        this.setTimerMode(timerMode);
        this.setCanPause(canPause);
        this.setTimerInterval(timerInterval);
        this.eventHandler.emit(ConfigBroadcastConstants.CONFIGS_UPDATED, this.boardSize);
    }
}