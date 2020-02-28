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
    name?: string;
}
export declare class Store<StoreState> {
    readonly persistenceDriver?: StorePersistentDriver<StoreState>;
    readonly version: string;
    readonly name: string;
    private eventManager;
    private readonly initialState;
    private frozenState;
    private _hook;
    private readonly opts;
    get state(): StoreState;
    private checkInitialStateType;
    constructor(initialState: StoreState, options?: StoreOptions, persistenceDriver?: StorePersistentDriver<StoreState>);
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
    resetState(): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType | StoreEventType[], includeKeys: Array<keyof StoreState>, callback: TOnFireWithKeys<StoreState>): StoreEventSpecificKeys<StoreState>;
    on(eventType: StoreEventType | StoreEventType[], callback: TOnFire<StoreState>): StoreEvent<StoreState>;
}
