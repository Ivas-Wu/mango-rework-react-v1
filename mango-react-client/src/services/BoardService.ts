import { BoardTileProperties, BoardTileState } from "../components/Board/BoardTileModels";
import { NumberService } from "./NumberService";

export class BoardService {
    private boardSize!: number;
    private boardTiles: BoardTileProperties[] = [];
    private numberService: NumberService;

    private static instance: BoardService;

    private constructor(size: number) {
        this.numberService = new NumberService(size);
        this.setBoardSize(size);
    }

    private createBoard() {
        let boardTiles: BoardTileProperties[] = [];
        for( let i = 0; i < this.boardSize * this.boardSize; i++ ) {
            boardTiles.push({
                idx: i,
                value: this.numberService.generateBoardNumber(),
                state: BoardTileState.NOT_COMPLETE,
                tileIdx: null,
            })
        }
        this.boardTiles = boardTiles;
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
            tile.idx === idx ? {...tile, tileIdx: tileIdx, state: BoardTileState.COMPLETE} : tile
        );
        return this.boardTiles;
    }
}
