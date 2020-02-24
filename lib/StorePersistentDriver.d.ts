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
    abstract clear(): void;
    abstract getDumpHistory(): number[];
    abstract removeDump(timestamp: number): void;
    pack(data: StoreState): StorePersistentPacket<StoreState>;
    reset(): StorePersistentPacket<StoreState>;
    get storeName(): string;
    get dumpHistoryName(): string;
}
