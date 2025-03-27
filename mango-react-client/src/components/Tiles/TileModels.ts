export interface TileProperties {
    idx: number;
    value: number;
    state: TileState;
    parents: number[];
    child: TileProperties | null;
}

export enum TileState {
    UNUSED = 1, // Unhighlighted and unused and uncommited
    USED = 2, // Unhighlighted and commited
    HELD = 3, // Unhighlighted and used
}

export enum Operator {
    ADD = '+',
    SUBTRACT = '-',
    MULTIPLY = 'x',
    DIVIDE = '/',
}