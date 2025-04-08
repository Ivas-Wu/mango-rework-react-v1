export class NumberService {
    private boardSize!: number;

    constructor(boardSize: number) {
        this.boardSize = boardSize;
    }

    private genNumber(value: number): number {
        return Math.floor(Math.random() * value)
    }

    public setBoardSize(size: number){
        this.boardSize = size;
    }

    public generateCardNumber(): number {
        // weighted distribution across valid numbers
        return this.genNumber(this.boardSize) + this.genNumber(this.boardSize - 1) + 1
    }

    public generateBoardNumber(): number {
        // weighted distribution across valid numbers
        return this.genNumber(this.boardSize*this.boardSize) + this.genNumber(this.boardSize*this.boardSize) + this.genNumber(this.boardSize*this.boardSize) + this.genNumber(this.boardSize - 1) + 1
    }
}