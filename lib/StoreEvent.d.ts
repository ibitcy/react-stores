export declare enum StoreEventType {
    All = 0,
    Init = 1,
    Update = 2,
    DumpUpdate = 3
}
export declare type TOnFire<T> = (storeState: T, prevState: T, type: StoreEventType) => void;
export declare type TOnFireWithKeys<T> = (storeState: T, prevState: T, includeKeys: Array<keyof T>, type: StoreEventType) => void;
export declare type TStoreEvent<T> = StoreEvent<T> | StoreEventSpecificKeys<T>;
export declare type TEventId = string;
export declare class StoreEvent<StoreState> {
    readonly id: TEventId;
    readonly types: StoreEventType[];
    readonly onFire: TOnFire<StoreState>;
    readonly onRemove: (id: TEventId) => void;
    timeout: any;
    constructor(id: TEventId, types: StoreEventType[], onFire: TOnFire<StoreState>, onRemove: (id: TEventId) => void);
    remove(): void;
}
export declare class StoreEventSpecificKeys<StoreState> {
    readonly id: TEventId;
    readonly types: StoreEventType[];
    readonly onFire: TOnFireWithKeys<StoreState>;
    readonly onRemove: (id: TEventId) => void;
    readonly includeKeys: Array<keyof StoreState>;
    timeout: any;
    constructor(id: TEventId, types: StoreEventType[], onFire: TOnFireWithKeys<StoreState>, onRemove: (id: TEventId) => void, includeKeys?: Array<keyof StoreState>);
    remove(): void;
}
