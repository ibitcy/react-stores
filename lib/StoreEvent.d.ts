export declare enum StoreEventType {
    All = 0,
    Init = 1,
    Update = 2,
    DumpUpdate = 3
}
export declare class StoreEvent<StoreState> {
    readonly id: string;
    readonly types: StoreEventType[];
    readonly onFire: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void;
    readonly onRemove: (id: string) => void;
    timeout: any;
    constructor(id: string, types: StoreEventType[], onFire: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void, onRemove: (id: string) => void);
    remove(): void;
}
