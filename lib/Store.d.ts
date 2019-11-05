import { StorePersistentDriver } from './StorePersistentDriver';
import { StoreEventType, StoreEvent } from './StoreEvent';
export interface StoreOptions {
    live?: boolean;
    persistence?: boolean;
    freezeInstances?: boolean;
    mutable?: boolean;
    setStateTimeout?: number;
}
export declare class Store<StoreState> {
    readonly persistenceDriver?: StorePersistentDriver<StoreState>;
    components: any[];
    readonly id: string;
    private eventManager;
    private readonly frozenState;
    private readonly initialState;
    private opts;
    constructor(initialState: StoreState, options?: StoreOptions, persistenceDriver?: StorePersistentDriver<StoreState>);
    get state(): StoreState;
    private hashCode;
    private generateStoreId;
    resetPersistence(): void;
    resetDumpHistory(): void;
    saveDump(): number;
    removeDump(timestamp: number): void;
    restoreDump(timestamp: number): void;
    getDumpHistory(): number[];
    setState(newState: Partial<StoreState>): void;
    resetState(): void;
    update(currentState: StoreState, prevState: StoreState): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void): StoreEvent<StoreState>;
}
