import { StorePersistentDriver, StorePersistentPacket } from './StorePersistentDriver';
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
