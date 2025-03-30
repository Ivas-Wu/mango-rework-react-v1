import { BoardTileProperties, BoardTileState } from "../components/Board/BoardTileModels";
import { NumberService } from "./NumberService";

export class BoardService {
    private boardSize!: number;
    private boardTiles: BoardTileProperties[] = [];
    private numberService: NumberService;

    private static instance: BoardService;

    private columnCounter!: number[];
    private rowCounter!: number[];
    private diagonalCounter!: number[];

    private constructor(size: number) {
        this.numberService = new NumberService(size);
        this.setBoardSize(size);
    }

    private createBoard() {
        let boardTiles: BoardTileProperties[] = [];
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            boardTiles.push({
                idx: i,
                value: this.numberService.generateBoardNumber(),
                state: BoardTileState.NOT_COMPLETE,
                tileIdx: null,
            })
        }
        this.boardTiles = boardTiles;
    }

    private updateBoardCounters(idx: number, increment: number = 1): void {
        const row = Math.floor(idx / this.boardSize);
        const col = idx % this.boardSize;

        this.rowCounter[row] += increment;
        this.columnCounter[col] += increment;
        if (this.rowCounter[row] === this.boardSize || this.columnCounter[col] === this.boardSize) {
            // verify win
        }

        if (row === col) {
            this.diagonalCounter[0] += increment;
            if (this.diagonalCounter[0] === this.boardSize) {
                // verify win
            }
        }

        if (row + col === this.boardSize - 1) {
            this.diagonalCounter[1] += increment;
            if (this.diagonalCounter[1] === this.boardSize) {
                // verify win
            }
        }
    }

    public static getInstance(): BoardService {
        if (!BoardService.instance) {
            BoardService.instance = new BoardService(4);
        }
        return BoardService.instance;
    }

    public setBoardSize(size: number) {
        this.boardSize = size;
        this.numberService.setBoardSize(size);
        this.columnCounter = new Array(size).fill(0);
        this.rowCounter = new Array(size).fill(0);
        this.diagonalCounter = new Array(2).fill(0);
        this.createBoard();
    }

    public getBoardSize(): number {
        return this.boardSize;
    }

    public getBoardData(): BoardTileProperties[] {
        return this.boardTiles;
    }

    public getBoardTileByIdx(idx: number): BoardTileProperties | null {
        const tile = this.boardTiles.find(tile => tile.idx === idx);
        return tile ? tile : null;
    }

    public getBoardTileByTileIdx(tileIdx: number): BoardTileProperties | null {
        const tile = this.boardTiles.find(tile => tile.tileIdx === tileIdx);
        return tile ? tile : null;
    }

    public setBoardTileComplete(idx: number, tileIdx: number): BoardTileProperties[] {
        this.boardTiles = this.boardTiles.map(tile =>
            tile.idx === idx ? { ...tile, tileIdx: tileIdx, state: BoardTileState.COMPLETE } : tile
        );

        this.updateBoardCounters(idx);
        return this.boardTiles;
    }

    public clearBoardTile(idx: number): BoardTileProperties[] {
        this.boardTiles = this.boardTiles.map(tile =>
            tile.idx === idx ? { ...tile, tileIdx: null, state: BoardTileState.NOT_COMPLETE } : tile
        );

        this.updateBoardCounters(idx, -1);
        return this.boardTiles;
    }
}
