import { StorePersistentDriver } from './StorePersistentDriver';

export interface StorePersistentDump<StoreState> {
  dumpHistory: StorePersistentPacket<StoreState>[];
}

export interface StorePersistentPacket<StoreState> {
  data: StoreState;
  timestamp: number;
}

// react-native adaptation
export abstract class StorePersistentDriverAsync<StoreState> extends StorePersistentDriver<StoreState> {
  public abstract writeAsync(pack: StorePersistentPacket<StoreState>): Promise<any>;

  public abstract readAsync(): Promise<StorePersistentPacket<StoreState> | undefined>;

  public write(pack: StorePersistentPacket<StoreState>): void {}

  public read(): StorePersistentPacket<StoreState> | undefined {
    return undefined;
  }

  saveDump(pack: StorePersistentPacket<any>): number {
    return 0;
  }

  readDump(id: number): StorePersistentPacket<any> {
    return undefined;
  }

  getDumpHistory(): number[] {
    return [];
  }

  removeDump(timestamp: number): void {}

  resetHistory(): void {}
}
