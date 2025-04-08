export class ConfigService {
    private boardSize!: number;
    private tilesToGen!: number;
    private timerInterval!: number;

    constructor(boardSize: number, tilesToGen: number, timerInterval: number) {
        this.setBoardSize(boardSize);
        this.setTilesToGen(tilesToGen);
        this.setTimerInterval(timerInterval);
    };

    public getBoardSize(): number {
        return this.boardSize;
    }

    public getTilesToGen(): number {
        return this.tilesToGen;
    }

    public getTimerInterval(): number {
        return this.timerInterval;
    }

    private setBoardSize(boardSize: number) {
        if (boardSize <= 1 || boardSize > 8) {
            throw Error();
        }
        this.boardSize = boardSize;
    }

    private setTilesToGen(count: number) {
        if (count < 1 || count > 8) {
            throw Error();
        }
        this.tilesToGen = count;
    }

    private setTimerInterval(time: number) {
        if (time <= 3 || time > 60) {
            throw Error();
        }
        this.timerInterval = time;
    }

    public save(boardSize: number, tilesToGen: number, timerInterval: number) {
        this.setBoardSize(boardSize);
        this.setTilesToGen(tilesToGen);
        this.setTimerInterval(timerInterval);
    }
}