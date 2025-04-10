export interface BoardTileProperties {
    idx: number;
    value: number;
    state: BoardTileState;
    tileIdx: number | null;
}

export enum BoardTileState {
    COMPLETE = 1,
    NOT_COMPLETE = 2,
}