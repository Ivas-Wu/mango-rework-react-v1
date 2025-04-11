import EventEmitter from 'events';
import { ReponseTypeConstants } from '../Constants/MessageConstants.ts';
import { Operator, TileBroadcastConstants, TileProperties, TileState } from '../Constants/TileConstants.ts';
import { ClientRequest, ClientResponse } from '../messageTypes.ts';
import { ConfigService } from './ConfigService.ts';
import { NumberService } from './NumberService.ts';
import { LoggingService } from './LoggingService.ts';

class TileSet {
    private basicTiles: TileProperties[] = [];
    private advancedTiles: TileProperties[] = [];
    private tileIdx: number = -1;
    private loggingService: LoggingService = LoggingService.getInstance();
    
    constructor(base?: TileSet) {
        this.basicTiles = base?.basicTiles ? [...base.basicTiles] : [];
        this.advancedTiles = base?.advancedTiles ? [...base.advancedTiles] : [];
    }
    

    private generateAdvancedTile(value: number, parents: number[]): TileProperties {
        const newTile: TileProperties = {
            idx: this.tileIdx--,
            value,
            state: TileState.UNUSED,
            parents,
            child: null,
        };
        this.addAdvancedTile(newTile);
        return newTile;
    }

    private getTileFromIdx(idx: number): TileProperties | undefined {
        const tile = this.basicTiles.find(tile => tile.idx === idx) || this.advancedTiles.find(tile => tile.idx === idx);
        if (!tile)  { 
            this.loggingService.logMessage(`Tile not found with index ${idx}.`);
            return;
        }
        return tile;
    }

    private findAllParents(idx: number): number[] {
        const tile = this.getTileFromIdx(idx);
        let res: number[] = [idx];
        tile?.parents.forEach((parentIdx: number) => {
            res = res.concat(this.findAllParents(parentIdx));
        });
        return res;
    }

    private findAllAssociated(idx: number): number[] {
        let baseTile = this.getTileFromIdx(idx);
        if (!baseTile) return [];
        while (baseTile.child) baseTile = baseTile.child;
        return this.findAllParents(baseTile.idx);
    }
    
    public addBasicTile(tile: TileProperties) {
        this.basicTiles.push(tile);
    }

    public getBasicTiles(): TileProperties[] {
        return this.basicTiles;
    }

    public addAdvancedTile(tile: TileProperties) {
        this.advancedTiles.push(tile);
    }

    public getAdvancedTiles(): TileProperties[] {
        return this.advancedTiles;
    }

    public reset() {
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

        if (tile1?.state !== TileState.UNUSED || tile2?.state !== TileState.UNUSED) {
            this.loggingService.logMessage(`Tile cannot be used.`);
            return;
        }
        if (tile1 === tile2) {
            this.loggingService.logMessage(`Same tile.`);
            return;
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
                    this.loggingService.logMessage("Cannot be divided");
                    return;
                }
                result = value;
                break;
            default:
                this.loggingService.logMessage(`Invalid operator: ${operator}`);
                return;
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

export class TileService {
    private tileIdx!: number;
    private tileMap: Map<string, TileSet> = new Map();
    private baseTileSet: TileSet = new TileSet(); // Basic set for searching and allowing new players to join
    private numberService!: NumberService;
    private configService!: ConfigService;
    private loggingService: LoggingService = LoggingService.getInstance();
    protected eventHandler!: EventEmitter;

    constructor(configService: ConfigService) {
        this.tileIdx = 0;
        this.configService = configService;
        const size = this.configService.getBoardSize();
        this.numberService = new NumberService(size);
        this.eventHandler = new EventEmitter();
    }

    private getTileSet(clientId: string): TileSet {
        const tileSet: TileSet | undefined = this.tileMap.get(clientId);
        if (!tileSet) {
            throw Error();
        }
        return tileSet;
    }

    public on(event: TileBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }

    public addClient(clientId: string) {
        this.tileMap.set(clientId, new TileSet(this.baseTileSet));
    }

    public removeClient(clientId: string) {
        this.tileMap.delete(clientId);
    }

    public getClientTiles(request: ClientRequest, selectLatest: boolean): ClientResponse {
        const tileSet: TileSet = this.getTileSet(request.clientId);
        const response: ClientResponse = {
            type: ReponseTypeConstants.UPDATED_TILES,
            clientId: request.clientId,
            requestId: request.requestId,
            session: request.session,
            data: JSON.stringify({ 
                basicTiles: tileSet.getBasicTiles(), 
                advancedTiles: tileSet.getAdvancedTiles(),
                selectLatest, 
            }),
        }
        return response;
    }

    public getAllTiles(): Map<string, TileSet> {
        return this.tileMap;
    }

    public generateBasicTiles(): void {
        for (let i = 0; i < this.configService.getTilesToGen(); i++) {
            let newTile: TileProperties = {
                idx: this.tileIdx++,
                value: this.numberService.generateCardNumber(),
                state: TileState.UNUSED,
                parents: [],
                child: null,
            }
            this.baseTileSet.addBasicTile(newTile);
            this.tileMap.forEach((value, key) => {
                value.addBasicTile(newTile);
            });
        }
        this.eventHandler.emit(TileBroadcastConstants.TILE_ADDED);
    }

    public reset(): void {
        this.baseTileSet.reset();
        this.tileMap.forEach((value, key) => {
            value.reset();
        });
    }

    public clearTile(idx: number, clientId: string): void {
        const tileSet: TileSet = this.getTileSet(clientId);
        tileSet.clearTile(idx);
    }

    public basicOperation(idx1: number, idx2: number, operator: Operator, clientId: string): void {
        const tileSet: TileSet = this.getTileSet(clientId);
        tileSet.basicOperation(idx1, idx2, operator);
    }

    public setTileUsed(idx: number, clientId: string): void {
        const tileSet: TileSet = this.getTileSet(clientId);
        tileSet.clearTile(idx);
    }
}