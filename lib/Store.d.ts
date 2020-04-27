import { StorePersistentDriver } from './StorePersistentDriver';
import { StorePersistentDriverAsync } from './StorePersistentDriverAsync';
import { StoreEventManager } from './StoreEventManager';
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
    name?: string;
    asyncPersistence?: boolean;
}
export declare class Store<StoreState> {
    readonly persistenceDriver?: StorePersistentDriver<StoreState> | StorePersistentDriverAsync<StoreState>;
    readonly version: string;
    readonly name: string;
    eventManager: StoreEventManager<StoreState> | null;
    private initialState;
    private frozenState;
    private _hook;
    private readonly opts;
    get state(): StoreState;
    constructor(initialState: StoreState, options?: StoreOptions, persistenceDriver?: StorePersistentDriver<StoreState> | StorePersistentDriverAsync<StoreState>);
    private execStateInitialization;
    private deepFreeze;
    private hashCode;
    private generateStoreId;
    resetPersistence(): void;
    clearPersistence(): void;
    resetDumpHistory(): void;
    saveDump(): number;
    removeDump(timestamp: number): void;
    restoreDump(timestamp: number): void;
    getDumpHistory(): number[];
    setState({ $actionName, ...newState }: Partial<StoreState> & {
        $actionName?: string;
    }): void;
    private execWrite;
    resetState(): void;
    removeStore(): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType | StoreEventType[], includeKeys: Array<keyof StoreState>, callback: TOnFireWithKeys<StoreState>): StoreEventSpecificKeys<StoreState>;
    on(eventType: StoreEventType | StoreEventType[], callback: TOnFire<StoreState>): StoreEvent<StoreState>;
}
