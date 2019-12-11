export interface StorePersistentDump<StoreState> {
  dumpHistory: StorePersistentPacket<StoreState>[];
}

export interface StorePersistentPacket<StoreState> {
  data: StoreState;
  timestamp: number;
}

export abstract class StorePersistentDriver<StoreState> {
  public persistence: boolean = true;

  constructor(readonly name: string, readonly lifetime: number = Infinity) {}

  public initialState: StoreState = null;

  public abstract type: string;

  public abstract write(pack: StorePersistentPacket<StoreState>): void;

  public abstract read(): StorePersistentPacket<StoreState>;

  public abstract saveDump(pack: StorePersistentPacket<StoreState>): number;

  public abstract readDump(id: number): StorePersistentPacket<StoreState>;

  public abstract resetHistory(): void;

  public abstract clear(): void;

  public abstract getDumpHistory(): number[];

  public abstract removeDump(timestamp: number): void;

  public pack(data: StoreState): StorePersistentPacket<StoreState> {
    return {
      data: data,
      timestamp: Date.now(),
    };
  }

  public reset(): StorePersistentPacket<StoreState> {
    const pack = this.pack(this.initialState);
    this.write(pack);
    return pack;
  }

  public get storeName(): string {
    return `store.persistent.${this.type}.${this.name}`.toLowerCase();
  }

  public get dumpHistoryName(): string {
    return `store.persistent.dump.history.${this.type}.${this.name}`.toLowerCase();
  }
}
