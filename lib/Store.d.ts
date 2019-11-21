import { StorePersistentDriver } from './StorePersistentDriver';
import { StoreEventType, StoreEvent, TOnFire, TOnFireWithKeys, StoreEventSpecificKeys } from './StoreEvent';
export interface StoreOptions {
    /**
     * @deprecated since 3.x: use immutable flag instead
     */
    live?: boolean;
    /**
     * @deprecated since 3.x: use immutable flag instead
     */
    freezeInstances?: boolean;
    immutable?: boolean;
    persistence?: boolean;
    setStateTimeout?: number;
    uniqKey?: string;
}
export declare class Store<StoreState> {
    readonly persistenceDriver?: StorePersistentDriver<StoreState>;
    components: any[];
    readonly id: string;
    private eventManager;
    private readonly initialState;
    private frozenState;
    private opts;
    get state(): StoreState;
    private checkInitialStateType;
    constructor(initialState: StoreState, options?: StoreOptions, persistenceDriver?: StorePersistentDriver<StoreState>);
    deepFreeze(obj: any): any;
    private hashCode;
    private generateStoreId;
    resetPersistence(): void;
    clearPersistence(): void;
    resetDumpHistory(): void;
    saveDump(): number;
    removeDump(timestamp: number): void;
    restoreDump(timestamp: number): void;
    getDumpHistory(): number[];
    setState(newState: Partial<StoreState>): void;
    resetState(): void;
    update(currentState: StoreState, prevState: StoreState): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType | StoreEventType[], includeKeys: Array<keyof StoreState>, callback: TOnFireWithKeys<StoreState>): StoreEventSpecificKeys<StoreState>;
    on(eventType: StoreEventType | StoreEventType[], callback: TOnFire<StoreState>): StoreEvent<StoreState>;
}
