import * as React from 'react';
export interface StorePersistentDump<StoreState> {
    dumpHistory: StorePersistentPacket<StoreState>[];
}
export interface StorePersistentPacket<StoreState> {
    data: StoreState;
    timestamp: number;
}
export declare abstract class StorePersistentDriver<StoreState> {
    readonly name: string;
    readonly lifetime: number;
    persistence: boolean;
    constructor(name: string, lifetime?: number);
    initialState: StoreState;
    abstract type: string;
    abstract write(pack: StorePersistentPacket<StoreState>): void;
    abstract read(): StorePersistentPacket<StoreState>;
    abstract saveDump(pack: StorePersistentPacket<StoreState>): number;
    abstract readDump(id: number): StorePersistentPacket<StoreState>;
    abstract resetHistory(): void;
    abstract getDumpHistory(): number[];
    abstract removeDump(timestamp: number): void;
    pack(data: StoreState): StorePersistentPacket<StoreState>;
    reset(): StorePersistentPacket<StoreState>;
    readonly storeName: string;
    readonly dumpHistoryName: string;
}
export declare class StorePersistentLocalStorageDriver<StoreState> extends StorePersistentDriver<StoreState> {
    readonly name: string;
    readonly lifetime: number;
    private storage;
    type: string;
    constructor(name: string, lifetime?: number);
    write(pack: StorePersistentPacket<StoreState>): void;
    read(): StorePersistentPacket<StoreState>;
    saveDump(pack: StorePersistentPacket<StoreState>): number;
    removeDump(timestamp: number): void;
    readDump(timestamp: number): StorePersistentPacket<StoreState>;
    getDumpHistory(): number[];
    resetHistory(): void;
}
/**
 * @deprecated since 2.x
 */
export declare abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    stores: Partial<StoreState>;
    private isStoreMounted;
    constructor(props: Props, stores: StoreState);
    storeComponentDidMount(): void;
    storeComponentWillUnmount(): void;
    storeComponentWillReceiveProps(nextProps: Props): void;
    storeComponentWillUpdate(nextProps: Props, nextState: State): void;
    storeComponentDidUpdate(prevProps: Props, prevState: State): void;
    shouldStoreComponentUpdate(nextProps: Props, nextState: State): boolean;
    storeComponentStoreWillUpdate(): void;
    storeComponentStoreDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentWillUpdate(nextProps: Props, nextState: State): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean;
}
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
    readonly state: StoreState;
    private hashCode;
    private generateStoreName;
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
    on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void): StoreEvent<StoreState>;
}
export declare enum StoreEventType {
    All = 0,
    Init = 1,
    Update = 2,
    DumpUpdate = 3
}
export declare class StoreEvent<StoreState> {
    readonly id: string;
    readonly types: StoreEventType[];
    readonly onFire: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void;
    readonly onRemove: (id: string) => void;
    timeout: any;
    constructor(id: string, types: StoreEventType[], onFire: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void, onRemove: (id: string) => void);
    remove(): void;
}
export declare const followStore: <StoreState>(store: Store<StoreState>) => (WrappedComponent: React.ComponentClass<any, any>) => any;
