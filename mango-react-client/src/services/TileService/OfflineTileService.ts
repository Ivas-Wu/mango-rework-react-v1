import { Operator, TileProperties, TileState } from '../../components/Tiles/TileModels';
import { ConfigService } from '../ConfigService';
import { NumberService } from '../NumberService';
import { TileService } from './TileService';
import { ConfigBroadcastConstants } from '../../constants/EventConstants';

export class OfflineTileService extends TileService {
    private tileIdx!: number;
    private numberService!: NumberService;
    private configService!: ConfigService;

    constructor(configService: ConfigService) {
        super();
        this.tileIdx = 0;
        this.configService = configService;
        const size = this.configService.getBoardSize();
        this.numberService = new NumberService(size);
        this.configService.on(ConfigBroadcastConstants.CONFIGS_UPDATED, () => {
            this.reset();
        });
    }

    private generateBasicTiles(): void {
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

    protected reset(): void {
        this.basicTiles = [];
        this.advancedTiles = [];
        this.broadCastTilesUpdated();
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

    public addTiles(fromTimer: boolean = false): void {
        if (this.configService.getTimerMode() !== fromTimer) return;
        this.generateBasicTiles();
        this.broadCastTilesUpdated();
    }

    public clearTile(idx: number): void {
        const associated = this.findAllAssociated(idx);
        this.basicTiles = this.basicTiles.map(tile =>
            associated.includes(tile.idx) ? { ...tile, state: TileState.UNUSED, child: null } : tile);
        this.advancedTiles = this.advancedTiles.filter(tile => !associated.includes(tile.idx));
        this.broadCastTilesUpdated();
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

        this.broadCastTilesUpdated(true);
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
}
