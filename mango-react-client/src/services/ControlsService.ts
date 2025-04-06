import EventEmitter from "events";
import { ConfigBroadcastConstants } from "../constants/EventConstants";
import { ControlConstants } from "../constants/StorageDefaults";
import { ControlDefaults } from "../constants/Defaults";

export class ControlsService {
    private static instance: ControlsService;

    private operationHotkeys!: String[];
    private eventHandler!: EventEmitter;
    private readonly numOfControls: number = 4;

    private constructor() {
        this.eventHandler = new EventEmitter();

        this.operationHotkeys = new Array(this.numOfControls).fill('');
        for (let i = 0; i < this.numOfControls; i++) {
            let operationKey: ControlConstants = this.operationKeyLookup(i);
            this.setOperations(operationKey, this.getStorageValue(operationKey), i);
        }
    };

    private getStorageValue(key: ControlConstants): string {
        return localStorage.getItem(key) ?? this.operationDefaultLookup(key);
    }

    private setStorageValue(key: ControlConstants, value: any) {
        localStorage.setItem(key, String(value));
    }

    private operationKeyLookup(idx: number): ControlConstants {
        switch (idx) {
            case 0:
                return ControlConstants.ADD;
            case 1:
                return ControlConstants.SUBTRACT;
            case 2:
                return ControlConstants.MULTIPLY;
            case 3:
                return ControlConstants.DIVIDE;
            default:
                throw Error(`No key of index ${idx} found.`);
        }
    }

    private operationDefaultLookup(key: ControlConstants): string {
        switch (key) {
            case ControlConstants.ADD:
                return ControlDefaults.ADD;
            case ControlConstants.SUBTRACT:
                return ControlDefaults.SUBTRACT;
            case ControlConstants.MULTIPLY:
                return ControlDefaults.MULTIPLY;
            case ControlConstants.DIVIDE:
                return ControlDefaults.DIVIDE;
            default:
                throw Error(`No default found for action: ${key}`);
        }
    }

    private setOperations(key: ControlConstants, value: string, idx: number) {
        this.setStorageValue(key, value);
        this.operationHotkeys[idx] = value;
    }

    public static getInstance() {
        if (!ControlsService.instance) {
            ControlsService.instance = new ControlsService();
        }
        return ControlsService.instance;
    }

    public getOperation(idx: number): String {
        return this.operationHotkeys[idx];
    }

    public on(event: ConfigBroadcastConstants, listener: (...args: any[]) => void): void {
        this.eventHandler.on(event, listener);
    }

    public save(idx: number, value: string) {
        let operationKey: ControlConstants = this.operationKeyLookup(idx);
        this.setOperations(operationKey, value, idx);
        // this.eventHandler.emit(ControlsService.CONTROLS_UPDATED, this.boardSize);
    }
}