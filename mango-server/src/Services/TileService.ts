import { Operator, TileProperties, TileState } from '../Constants/TileConstants.ts';
import { ConfigService } from './ConfigService.ts';
import { NumberService } from './NumberService.ts';

export class TileService {
    private tileIdx!: number;
    private basicTiles: TileProperties[] = [];
    private advancedTiles: TileProperties[] = [];
    private numberService!: NumberService;
    private configService!: ConfigService;

    constructor(configService: ConfigService) {
        this.tileIdx = 0;
        this.configService = configService;
        const size = this.configService.getBoardSize();
        this.numberService = new NumberService(size);
    }

    private generateAdvancedTile(value: number, parents: number[]): TileProperties {
        const newTile: TileProperties = {
            idx: this.tileIdx++,
            value,
            state: TileState.UNUSED,
            parents,
            child: null,
        };
        this.advancedTiles.push(newTile);
        return newTile;
    }

    private findAllAssociated(idx: number): number[] {
        let baseTile = this.getTileFromIdx(idx);
        while (baseTile.child) baseTile = baseTile.child;
        return this.findAllParents(baseTile.idx);
    }

    private getTileFromIdx(idx: number): TileProperties {
        const tile = this.basicTiles.find(tile => tile.idx === idx) || this.advancedTiles.find(tile => tile.idx === idx);
        if (!tile) throw new Error(`Tile not found with index ${idx}.`);
        return tile;
    }

    private findAllParents(idx: number): number[] {
        const tile = this.getTileFromIdx(idx);
        let res: number[] = [idx];
        tile.parents.forEach((parentIdx: number) => {
            res = res.concat(this.findAllParents(parentIdx));
        });
        return res;
    }

    public generateBasicTiles(): void {
        for (let i = 0; i < this.configService.getTilesToGen(); i++) {
            this.basicTiles.push({
                idx: this.tileIdx++,
                value: this.numberService.generateCardNumber(),
                state: TileState.UNUSED,
                parents: [],
                child: null,
            });
        }
    }

    public reset(): void {
        this.basicTiles = [];
        this.advancedTiles = [];
    }

    public clearTile(idx: number): void {
        const associated = this.findAllAssociated(idx);
        this.basicTiles = this.basicTiles.map(tile =>
            associated.includes(tile.idx) ? { ...tile, state: TileState.UNUSED, child: null } : tile);
        this.advancedTiles = this.advancedTiles.filter(tile => !associated.includes(tile.idx));
    }

    public basicOperation(idx1: number, idx2: number, operator: Operator): void {
        const tile1 = this.getTileFromIdx(idx1);
        const tile2 = this.getTileFromIdx(idx2);

        if (tile1.state !== TileState.UNUSED || tile2.state !== TileState.UNUSED) {
            throw new Error(`Tile cannot be used.`);
        }
        if (tile1 === tile2) {
            throw new Error(`Same tile.`);
        }

        let result: number;
        switch (operator) {
            case Operator.ADD:
                result = tile1.value + tile2.value;
                break;
            case Operator.SUBTRACT:
                result = Math.abs(tile1.value - tile2.value);
                break;
            case Operator.MULTIPLY:
                result = tile1.value * tile2.value;
                break;
            case Operator.DIVIDE:
                const value = tile1.value / tile2.value;
                if (value !== Math.floor(value)) {
                    throw new Error("Cannot be divided");
                }
                result = value;
                break;
            default:
                throw new Error(`Invalid operator: ${operator}`);
        }

        const newTile = this.generateAdvancedTile(result, [tile1.idx, tile2.idx]);

        this.basicTiles = this.basicTiles.map(tile =>
            tile.idx === idx1 || tile.idx === idx2 ? { ...tile, state: TileState.HELD, child: newTile } : tile
        );
        this.advancedTiles = this.advancedTiles.map(tile =>
            tile.idx === idx1 || tile.idx === idx2 ? { ...tile, state: TileState.HELD, child: newTile } : tile
        );
    }

    public setTileUsed(idx: number): void {
        this.basicTiles = this.basicTiles.map(tile =>
            tile.idx === idx ? { ...tile, state: TileState.USED } : tile
        );
        this.advancedTiles = this.advancedTiles.map(tile =>
            tile.idx === idx ? { ...tile, state: TileState.USED } : tile
        );
    }
}