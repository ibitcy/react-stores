export declare enum StoreEventType {
    All = 0,
    Init = 1,
    Update = 2,
    DumpUpdate = 3
}
export declare type TOnFire<T> = (storeState: T, prevState: T, type: StoreEventType) => void;
export declare type TOnFireWithKeys<T> = (storeState: T, prevState: T, includeKeys: Array<keyof T>, type: StoreEventType) => void;
export declare type TStoreEvent<T> = StoreEvent<T> | StoreEventSpecificKeys<T>;
export declare class StoreEvent<StoreState> {
    readonly id: string;
    readonly types: StoreEventType[];
    readonly onFire: TOnFire<StoreState>;
    readonly onRemove: (id: string) => void;
    timeout: any;
    constructor(id: string, types: StoreEventType[], onFire: TOnFire<StoreState>, onRemove: (id: string) => void);
    remove(): void;
}
export declare class StoreEventSpecificKeys<StoreState> {
    readonly id: string;
    readonly types: StoreEventType[];
    readonly onFire: TOnFireWithKeys<StoreState>;
    readonly onRemove: (id: string) => void;
    readonly includeKeys: Array<keyof StoreState>;
    timeout: any;
    constructor(id: string, types: StoreEventType[], onFire: TOnFireWithKeys<StoreState>, onRemove: (id: string) => void, includeKeys?: Array<keyof StoreState>);
    remove(): void;
}
