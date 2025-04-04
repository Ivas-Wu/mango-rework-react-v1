import EventEmitter from "events";
import { configDefaults } from "../constants/defaults";

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

        this.setBoardSize(Number(localStorage.getItem('boardSize')) || configDefaults.BOARD_SIZE);
        this.setTilesToGen(Number(localStorage.getItem('tilesToGen')) || configDefaults.TILES_TO_GEN);
        this.setTimerMode(Boolean(localStorage.getItem('timerMode')) || configDefaults.TIMER_MODE);
        this.setTimerInterval(Number(localStorage.getItem('timerInterval')) || configDefaults.INTERVAL);

        this.operationHotkeys = new Array(4).fill(0);
        this.setOperation1(localStorage.getItem('operation1') || 'q');
        this.setOperation2(localStorage.getItem('operation2') || 'w');
        this.setOperation3(localStorage.getItem('operation3') || 'e');
        this.setOperation4(localStorage.getItem('operation4') || 'r');
    };

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
        if (boardSize <= 1 || boardSize > 8) boardSize = configDefaults.BOARD_SIZE
        localStorage.setItem('boardSize', String(boardSize));
        this.boardSize = boardSize;
        this.eventHandler.emit('boardSizeUpdated', this.boardSize);
    }

    public setTilesToGen(count: number) {
        if (count < 1 || count > 8) count = configDefaults.TILES_TO_GEN
        localStorage.setItem('tilesToGen', String(count));
        this.tilesToGen = count;
    }

    public setTimerMode(set: boolean) {
        localStorage.setItem('timerMode', String(set));
        this.timerMode = set;
    }

    public setTimerInterval(time: number) {
        if (time <= 3 || time > 60) time = configDefaults.INTERVAL
        localStorage.setItem('timerInterval', String(time));
        this.timerInterval = time;
    }

    public setOperation1(key: String) {
        localStorage.setItem('oepration1', String(key));
        this.operationHotkeys[0] = key;
    }

    public setOperation2(key: String) {
        localStorage.setItem('oepration2', String(key));
        this.operationHotkeys[1] = key;
    }

    public setOperation3(key: String) {
        localStorage.setItem('oepration3', String(key));
        this.operationHotkeys[2] = key;
    }

    public setOperation4(key: String) {
        localStorage.setItem('oepration4', String(key));
        this.operationHotkeys[3] = key;
    }

    public getEventHandlerInstance(): EventEmitter {
        return this.eventHandler;
    }
}