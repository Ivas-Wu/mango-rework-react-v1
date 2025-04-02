export class ConfigService {
    private boardSize!: number;
    private timerCount!: number;

    private static instance: ConfigService;

    private operationHotkeys!: String[];

    private constructor() {
        this.setBoardSize(Number(localStorage.getItem('boardSize')) ?? 3);
        this.setBoardSize(Number(localStorage.getItem('timerCount')) ?? 15);
        this.operationHotkeys = new Array(4).fill(0);
        this.setOperation1(localStorage.getItem('operation1') ?? 'q');
        this.setOperation2(localStorage.getItem('operation2') ?? 'w');
        this.setOperation3(localStorage.getItem('operation3') ?? 'e');
        this.setOperation4(localStorage.getItem('operation4') ?? 'r');
    };

    public static getInstance() {
        if(!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public setBoardSize(boardSize: number) {
        localStorage.setItem('boardSize', String(boardSize));
        this.boardSize = boardSize;
    }

    public setTimerCount(time: number) {
        localStorage.setItem('timerCount', String(time));
        this.timerCount = time;
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

    public getOperation(idx: number) {
        return this.operationHotkeys[idx];
    }
}