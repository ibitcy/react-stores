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
    abstract write(pack: StorePersistentPacket<StoreState>): any;
    abstract read(): StorePersistentPacket<StoreState>;
    abstract saveDump(pack: StorePersistentPacket<StoreState>): number;
    abstract readDump(id: number): StorePersistentPacket<StoreState>;
    abstract resetHistory(): any;
    abstract getDumpHistory(): number[];
    abstract removeDump(timestamp: number): any;
    pack(data: StoreState): StorePersistentPacket<StoreState>;
    reset(): StorePersistentPacket<StoreState>;
    readonly storeName: string;
    readonly dumpHistoryName: string;
}
