import { StorePersistentDriver, StorePersistentPacket, StorePersistentDump } from './StorePersistentDriver';

export class StorePersistentLocalStorageDriver<StoreState> extends StorePersistentDriver<StoreState> {
  readonly storage = null;
  public type: string = 'localStorage';

  constructor(readonly name: string, readonly lifetime: number = Infinity) {
    super(name, lifetime);

    if (typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
    }
  }

  public write(pack: StorePersistentPacket<StoreState>) {
    if (this.storage && this.persistence) {
      try {
        this.storage.setItem(this.storeName, JSON.stringify(pack));
      } catch (e) {
        console.error(e);
      }
    }
  }

  public read(): StorePersistentPacket<StoreState> {
    if (this.storage && this.persistence) {
      let dump = null;

      try {
        dump = JSON.parse(this.storage.getItem(this.storeName));

        if (!Boolean(dump) && !Boolean(dump.timestamp)) {
          dump = this.reset();
        }
      } catch (e) {
        dump = this.reset();
      }

      return dump;
    } else {
      return this.reset();
    }
  }

  public saveDump(pack: StorePersistentPacket<StoreState>): number {
    let timestamp: number = pack.timestamp;

    if (this.storage && this.persistence) {
      try {
        const dumpHistory: StorePersistentDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHistoryName));

        if (dumpHistory && dumpHistory.dumpHistory) {
          dumpHistory.dumpHistory.push(pack);

          this.storage.setItem(this.dumpHistoryName, JSON.stringify(dumpHistory));
        } else {
          this.storage.setItem(
            this.dumpHistoryName,
            JSON.stringify({
              dumpHistory: [pack],
            }),
          );
        }
      } catch (e) {
        try {
          this.storage.setItem(
            this.dumpHistoryName,
            JSON.stringify({
              dumpHistory: [pack],
            }),
          );
        } catch (e) {
          console.error(e);
          timestamp = null;
        }

        console.error(e);
        timestamp = null;
      }
    }

    return timestamp;
  }

  public removeDump(timestamp: number) {
    if (this.storage && this.persistence) {
      try {
        const dumpHistory: StorePersistentDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHistoryName));

        if (dumpHistory && dumpHistory.dumpHistory) {
          const newDumpHistory: StorePersistentPacket<StoreState>[] = dumpHistory.dumpHistory.filter(
            (dump: StorePersistentPacket<StoreState>) => dump.timestamp !== timestamp,
          );

          this.storage.setItem(
            this.dumpHistoryName,
            JSON.stringify({
              dumpHistory: newDumpHistory,
            }),
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  public readDump(timestamp: number): StorePersistentPacket<StoreState> {
    let dump: StorePersistentPacket<StoreState> = null;

    if (this.storage && this.persistence) {
      try {
        const dumpHistory: StorePersistentDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHistoryName));

        if (dumpHistory && dumpHistory.dumpHistory) {
          dump = dumpHistory.dumpHistory.find(pack => pack.timestamp === timestamp);
        } else {
          dump = null;
        }
      } catch (e) {
        console.error(e);
      }
    }

    return dump;
  }

  public getDumpHistory(): number[] {
    let history: number[] = [];

    if (this.storage && this.persistence) {
      try {
        const dumpHistory: StorePersistentDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHistoryName));

        if (dumpHistory && dumpHistory.dumpHistory) {
          history = dumpHistory.dumpHistory.map((pack: StorePersistentPacket<StoreState>) => pack.timestamp);
        }
      } catch (e) {
        console.error(e);
        history = [];
      }
    }

    return history;
  }

  public resetHistory() {
    if (this.storage && this.persistence) {
      try {
        this.storage.setItem(
          this.dumpHistoryName,
          JSON.stringify({
            dumpHistory: [],
          }),
        );
      } catch (e) {
        console.error(e);
      }
    }
  }
}
