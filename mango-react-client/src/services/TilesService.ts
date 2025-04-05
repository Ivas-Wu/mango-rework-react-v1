import EventEmitter from 'events';
import { Operator, TileProperties, TileState } from '../components/Tiles/TileModels';
import { ConfigService } from './ConfigService';
import { NumberService } from './NumberService';
import { TimerService } from './TimerService';
import { TileBroadcastConstants } from '../constants/EventConstants';

export class TileService {
    private tileIdx: number;

    private configService: ConfigService;
    private numberService: NumberService;
    private timerService: TimerService;

    private basicTiles: TileProperties[] = [];
    private advancedTiles: TileProperties[] = [];
    private eventHandler!: EventEmitter;

    private static instance: TileService;

    private constructor() {
        this.tileIdx = 0;

        this.configService = ConfigService.getInstance();
        const size = this.configService.getBoardSize();
        this.numberService = new NumberService(size);
        this.timerService = TimerService.getInstance();
        this.eventHandler = new EventEmitter();
    }

    private generateBasicTiles() {
        const newBasicTiles = [...this.basicTiles];
        for (let i = 0; i < this.configService.getTilesToGen(); i++) {
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

    private broadCastTilesUpdated() {
        this.eventHandler.emit(TileBroadcastConstants.TIMES_UPDATED);
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

    public on(event: TileBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }

    public reset(): [TileProperties[], TileProperties[]] {
        this.basicTiles = [];
        this.advancedTiles = [];
        return this.getTiles();
    }

    public getTiles(): [TileProperties[], TileProperties[]] {
        return [this.basicTiles, this.advancedTiles];
    }

    public getTileFromIdx(idx: number): TileProperties {
        const tile = this.basicTiles.find(tile => tile.idx === idx) || this.advancedTiles.find(tile => tile.idx === idx);
        if (!tile) {
            throw new Error(`Tile not found with index ${idx}.`);
        }
        return tile;
    }

    public addTiles(): void {
        this.generateBasicTiles();
        this.broadCastTilesUpdated();
    }

    public clearTile(idx: number): void {
        const associated = this.findAllAssociated(idx);
        this.basicTiles = this.basicTiles.map((tile: TileProperties) =>
            associated.includes(tile.idx) ? { ...tile, state: TileState.UNUSED, child: null } : tile);
        this.advancedTiles = this.advancedTiles.filter((tile: TileProperties) =>
            !associated.includes(tile.idx));
        this.broadCastTilesUpdated();
    }

    public findBaseChild(idx: number): TileProperties {
        let tile = this.getTileFromIdx(idx);
        while (tile.child) {
            tile = tile.child;
        }
        return tile;
    }

    public findAllAssociated(idx: number): number[] {
        const baseTile = this.findBaseChild(idx);
        return this.findAllParents(baseTile.idx);
    }

    public basicOperation(idx1: number, idx2: number, operator: Operator): void {
        const tile1 = this.basicTiles.find(tile => tile.idx === idx1) || this.advancedTiles.find(tile => tile.idx === idx1);
        const tile2 = this.basicTiles.find(tile => tile.idx === idx2) || this.advancedTiles.find(tile => tile.idx === idx2);

        if (!tile1 || !tile2) {
            throw new Error(`Tile not found.`);
        }
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

        this.broadCastTilesUpdated();
    }

    public setTileUsed(idx: number): void {
        this.basicTiles = this.basicTiles.map(tile =>
            tile.idx === idx ? { ...tile, state: TileState.USED } : tile
        );
        this.advancedTiles = this.advancedTiles.map(tile =>
            tile.idx === idx ? { ...tile, state: TileState.USED } : tile
        );

        this.broadCastTilesUpdated();
    }

    public startTimer() {
        if (!this.configService.getTimerMode()) return
        this.timerService.setInterval(this.configService.getTimerInterval());
        this.timerService.startTimer(() => this.addTiles());
    }

    public stopTimer() {
        this.timerService.stopTimer();
        // logging service to record records
    }
}
