import { Operator, TileProperties, TileState } from '../components/Tiles/TileModels';
import { NumberService } from './NumberService';

export class TileService {
    private tilesToGen: number;
    private tileIdx: number;
    private numberService: NumberService;

    private basicTiles: TileProperties[] = [];
    private advancedTiles: TileProperties[] = [];

    private static instance: TileService;

    private constructor() {
        this.tilesToGen = 3;
        this.tileIdx = 0;
        this.numberService = new NumberService(4);
    }

    private generateBasicTiles() {
        const newBasicTiles = [...this.basicTiles];
        for (let i = 0; i < this.tilesToGen; i++) {
            newBasicTiles.push({
                idx: this.tileIdx,
                value: this.numberService.generateCardNumber(),
                state: TileState.UNUSED,
                parents: [],
                child: null,
            });
            this.tileIdx++;
        }
        this.basicTiles = newBasicTiles;
    }

    private generateAdvancedTile(value: number, parents: number[]): TileProperties {
        const newAdvancedTiles = [...this.advancedTiles];
        const newTile: TileProperties = 
        {
            idx: this.tileIdx,
            value: value,
            state: TileState.UNUSED,
            parents: parents,
            child: null,
        };
        newAdvancedTiles.push(newTile);
        this.tileIdx++;
        this.advancedTiles = newAdvancedTiles;
        return newTile;
    }

    private findAllParents(idx: number): number[] {
        const tile = this.getTileFromIdx(idx);
        let res: number[] = [idx];
        tile.parents.forEach(parentIdx => {
            res = res.concat(this.findAllParents(parentIdx));
        });
        return res;
    }

    public static getInstance(): TileService {
        if (!TileService.instance) {
            TileService.instance = new TileService();
        }
        return TileService.instance;
    }

    public getTileFromIdx(idx: number): TileProperties {
        const tile = this.basicTiles.find(tile => tile.idx === idx) || this.advancedTiles.find(tile => tile.idx === idx);
        if(!tile) {
            throw new Error(`Tile not found with index ${idx}.`);
        }
        return tile;
    }

    public addTiles(): [TileProperties[], TileProperties[]] {
        this.generateBasicTiles();
        return [this.basicTiles, this.advancedTiles];
    }

    public clearTile(idx: number): [TileProperties[], TileProperties[]] {
        const associated = this.findAllAssociated(idx);
        this.basicTiles = this.basicTiles.map((tile: TileProperties) => 
            associated.includes(tile.idx) ? { ...tile, state: TileState.UNUSED, child: null } : tile);
        this.advancedTiles = this.advancedTiles.filter((tile: TileProperties) => 
            !associated.includes(tile.idx));
        return [this.basicTiles, this.advancedTiles];
    }

    public findBaseChild(idx: number): TileProperties {
        let tile = this.getTileFromIdx(idx);
        while(tile.child) {
            tile = tile.child;
        }
        return tile; 
    }

    public findAllAssociated(idx: number): number[] {
        const baseTile = this.findBaseChild(idx);
        return this.findAllParents(baseTile.idx);
    }

    public basicOperation(idx1: number, idx2: number, operator: Operator): [TileProperties[], TileProperties[]] {
        const tile1 = this.basicTiles.find(tile => tile.idx === idx1) || this.advancedTiles.find(tile => tile.idx === idx1);
        const tile2 = this.basicTiles.find(tile => tile.idx === idx2) || this.advancedTiles.find(tile => tile.idx === idx2);
    
        if (!tile1 || !tile2) {
            throw new Error(`Tile not found.`);
        }
        if (tile1.state !== TileState.UNUSED || tile2.state !== TileState.UNUSED) {
            throw new Error(`Tile cannot be used.`);
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
                const value = tile1.value / tile2.value
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
    
        return [this.basicTiles, this.advancedTiles];
    }

    public setTileUsed(idx: number): [TileProperties[], TileProperties[]] {
        this.basicTiles = this.basicTiles.map(tile => 
            tile.idx === idx ? {...tile, state: TileState.USED} : tile
        );
        this.advancedTiles = this.advancedTiles.map(tile => 
            tile.idx === idx ? {...tile, state: TileState.USED} : tile
        );

        return [this.basicTiles, this.advancedTiles];
    }
}
