import * as React from 'react';
export interface StorePersistantDump<StoreState> {
    dumpHistory: StorePersistantPacket<StoreState>[];
}
export interface StorePersistantPacket<StoreState> {
    data: StoreState;
    timestamp: number;
}
export declare abstract class StorePersistantDriver<StoreState> {
    readonly name: string;
    readonly lifetime: number;
    persistence: boolean;
    constructor(name: string, lifetime?: number);
    initialState: StoreState;
    abstract type: string;
    abstract write(pack: StorePersistantPacket<StoreState>): void;
    abstract read(): StorePersistantPacket<StoreState>;
    abstract saveDump(pack: StorePersistantPacket<StoreState>): number;
    abstract readDump(id: number): StorePersistantPacket<StoreState>;
    abstract resetHistory(): void;
    abstract getDumpHistory(): number[];
    abstract removeDump(timestamp: number): void;
    pack(data: StoreState): StorePersistantPacket<StoreState>;
    reset(): StorePersistantPacket<StoreState>;
    readonly storeName: string;
    readonly dumpHystoryName: string;
}
export declare class StorePersistentLocalSrorageDriver<StoreState> extends StorePersistantDriver<StoreState> {
    readonly name: string;
    readonly lifetime: number;
    private storage;
    type: string;
    constructor(name: string, lifetime?: number);
    write(pack: StorePersistantPacket<StoreState>): void;
    read(): StorePersistantPacket<StoreState>;
    saveDump(pack: StorePersistantPacket<StoreState>): number;
    removeDump(timestamp: number): void;
    readDump(timestamp: number): StorePersistantPacket<StoreState>;
    getDumpHistory(): number[];
    resetHistory(): void;
}
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
}
export declare class Store<StoreState> {
    readonly persistenceDriver?: StorePersistantDriver<StoreState>;
    components: any[];
    readonly id: string;
    private eventManager;
    private readonly frozenState;
    private readonly initialState;
    private opts;
    constructor(initialState: StoreState, options?: StoreOptions, persistenceDriver?: StorePersistantDriver<StoreState>);
    readonly state: StoreState;
    private hashCode;
    private generateStoreName;
    resetPersistence(): void;
    resetDumpHistory(): void;
    saveDump(): void;
    removeDump(timestamp: number): void;
    restoreDump(timestamp: number): void;
    getDumpHistory(): number[];
    setState(newState: Partial<StoreState>): void;
    resetState(): void;
    update(currentState: StoreState, prevState: StoreState): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void): StoreEvent<StoreState>;
}
export declare type StoreEventType = 'all' | 'init' | 'update' | 'dumpUpdate';
export declare class StoreEvent<StoreState> {
    readonly id: string;
    readonly types: StoreEventType[];
    readonly onFire: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void;
    readonly onRemove: (id: string) => void;
    constructor(id: string, types: StoreEventType[], onFire: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void, onRemove: (id: string) => void);
    remove(): void;
}
export declare const followStore: <StoreState>(store: Store<StoreState>, followStates?: string[]) => (WrappedComponent: React.ComponentClass<{}, any>) => any;
