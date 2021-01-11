import { StorePersistentDriver } from './StorePersistentDriver';
export interface StorePersistentDump<StoreState> {
    dumpHistory: StorePersistentPacket<StoreState>[];
}
export interface StorePersistentPacket<StoreState> {
    data: StoreState;
    timestamp: number;
}
export declare abstract class StorePersistentDriverAsync<StoreState> extends StorePersistentDriver<StoreState> {
    abstract writeAsync(pack: StorePersistentPacket<StoreState>): Promise<any>;
    abstract readAsync(): Promise<StorePersistentPacket<StoreState> | undefined>;
    write(pack: StorePersistentPacket<StoreState>): void;
    read(): StorePersistentPacket<StoreState> | undefined;
    saveDump(pack: StorePersistentPacket<any>): number;
    readDump(id: number): StorePersistentPacket<any>;
    getDumpHistory(): number[];
    removeDump(timestamp: number): void;
    resetHistory(): void;
}
