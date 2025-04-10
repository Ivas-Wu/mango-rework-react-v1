import EventEmitter from 'events';
import { Operator, TileProperties } from '../../components/Tiles/TileModels';
import { TileBroadcastConstants } from '../../constants/EventConstants';

export abstract class TileService {
    protected basicTiles: TileProperties[] = [];
    protected advancedTiles: TileProperties[] = [];
    protected eventHandler!: EventEmitter;

    protected abstract reset(): void;
    public abstract basicOperation(idx1: number, idx2: number, operator: Operator): void;
    public abstract setTileUsed(idx: number): void;
    public abstract addTiles(fromTimer?: boolean): void;
    public abstract clearTile(idx: number): void;

    protected constructor() {
        this.eventHandler = new EventEmitter();
    }

    protected broadCastTilesUpdated(operation: boolean = false): void {
        this.eventHandler.emit(TileBroadcastConstants.TILES_UPDATED, operation);
    }

    public on(event: TileBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }

    public getTiles(): [TileProperties[], TileProperties[]] {
        return [this.basicTiles, this.advancedTiles];
    }

    public getTileFromIdx(idx: number): TileProperties {
        const tile = this.basicTiles.find(tile => tile.idx === idx) || this.advancedTiles.find(tile => tile.idx === idx);
        if (!tile) throw new Error(`Tile not found with index ${idx}.`);
        return tile;
    }

    public findBaseChild(idx: number): TileProperties {
        let tile = this.getTileFromIdx(idx);
        while (tile.child) tile = tile.child;
        return tile;
    }

    public findAllParents(idx: number): number[] {
        const tile = this.getTileFromIdx(idx);
        let res: number[] = [idx];
        tile.parents.forEach(parentIdx => {
            res = res.concat(this.findAllParents(parentIdx));
        });
        return res;
    }

    public findAllAssociated(idx: number): number[] {
        const baseTile = this.findBaseChild(idx);
        return this.findAllParents(baseTile.idx);
    }
}
