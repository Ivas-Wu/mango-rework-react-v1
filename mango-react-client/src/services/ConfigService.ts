import EventEmitter from "events";
import { ConfigDefaults } from "../constants/Defaults";
import { ConfigBroadcastConstants } from "../constants/EventConstants";
import { ConfigStorageConstants } from "../constants/StorageDefaults";

export class ConfigService {
    private boardSize!: number;
    private tilesToGen!: number;

    private timerMode!: boolean;
    private timerInterval!: number;

    private static instance: ConfigService;

    private operationHotkeys!: String[];
    private eventHandler!: EventEmitter;

    private constructor() {
        this.eventHandler = new EventEmitter();

        this.setBoardSize(Number(this.getStorageValue(ConfigStorageConstants.BOARD_SIZE)) || ConfigDefaults.BOARD_SIZE);
        this.setTilesToGen(Number(this.getStorageValue(ConfigStorageConstants.TILES_TO_GEN)) || ConfigDefaults.TILES_TO_GEN);
        this.setTimerMode(Boolean(this.getStorageValue(ConfigStorageConstants.TIMER_MODE)) || ConfigDefaults.TIMER_MODE);
        this.setTimerInterval(Number(this.getStorageValue(ConfigStorageConstants.TIMER_INTERVAL)) || ConfigDefaults.INTERVAL);

        this.operationHotkeys = new Array(4).fill(0);
        this.setOperation1(this.getStorageValue(ConfigStorageConstants.OPERATION1) || 'q');
        this.setOperation2(this.getStorageValue(ConfigStorageConstants.OPERATION2) || 'w');
        this.setOperation3(this.getStorageValue(ConfigStorageConstants.OPERATION3) || 'e');
        this.setOperation4(this.getStorageValue(ConfigStorageConstants.OPERATION4) || 'r');
    };

    private getStorageValue(key: ConfigStorageConstants) {
        return localStorage.getItem(key);
    }

    private setStorageValue(key: ConfigStorageConstants, value: any) {
        localStorage.setItem(key, String(value));
    }

    public static getInstance() {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
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

    public getTimerInterval(): number {
        return this.timerInterval;
    }

    public getOperation(idx: number): String {
        return this.operationHotkeys[idx];
    }

    public setBoardSize(boardSize: number) {
        if (boardSize <= 1 || boardSize > 8) boardSize = ConfigDefaults.BOARD_SIZE
        this.setStorageValue(ConfigStorageConstants.BOARD_SIZE, boardSize);
        this.boardSize = boardSize;
        this.eventHandler.emit(ConfigBroadcastConstants.BOARD_SIZE_UPDATED, this.boardSize);
    }

    public setTilesToGen(count: number) {
        if (count < 1 || count > 8) count = ConfigDefaults.TILES_TO_GEN
        this.setStorageValue(ConfigStorageConstants.TILES_TO_GEN, count);
        this.tilesToGen = count;
    }

    public setTimerMode(set: boolean) {
        this.setStorageValue(ConfigStorageConstants.TIMER_MODE, set);
        this.timerMode = set;
    }

    public setTimerInterval(time: number) {
        if (time <= 3 || time > 60) time = ConfigDefaults.INTERVAL
        this.setStorageValue(ConfigStorageConstants.TIMER_INTERVAL, time);
        this.timerInterval = time;
    }

    public setOperation1(key: String) {
        this.setStorageValue(ConfigStorageConstants.OPERATION1, key);
        this.operationHotkeys[0] = key;
    }

    public setOperation2(key: String) {
        this.setStorageValue(ConfigStorageConstants.OPERATION2, key);
        this.operationHotkeys[1] = key;
    }

    public setOperation3(key: String) {
        this.setStorageValue(ConfigStorageConstants.OPERATION3, key);
        this.operationHotkeys[2] = key;
    }

    public setOperation4(key: String) {
        this.setStorageValue(ConfigStorageConstants.OPERATION4, key);
        this.operationHotkeys[3] = key;
    }

    public on(event: ConfigBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }
}