import { Operator } from '../../components/Tiles/TileModels';
import { TileService } from './TileService';

export class OnlineTileService extends TileService {
    protected generateBasicTiles(): void {
        this.basicTiles = this.basicTiles; // get form ws
    }

    protected reset(): void {
        this.broadCastTilesUpdated();
    }

    public addTiles(fromTimer: boolean = false): void {
        // never need to add tiles but need this stub
    }

    public clearTile(idx: number): void {
        this.broadCastTilesUpdated();
    }

    public basicOperation(idx1: number, idx2: number, operator: Operator): void {
        this.broadCastTilesUpdated(true);
    }

    public setTileUsed(idx: number): void {
        this.broadCastTilesUpdated();
    }
}
