import { StorePersistentDriver } from './StorePersistentDriver';
import { StorePersistentLocalStorageDriver } from './StorePersistentLocalStorageDriver';
import { StoreEventManager } from './StoreEventManager';
import { StoreEventType, StoreEvent } from './StoreEvent';

export interface StoreOptions {
  /**
   * @deprecated since 3.x
   */
  live?: boolean;
  /**
   * @deprecated since 3.x
   */
  freezeInstances?: boolean;
  mutable?: boolean;
  persistence?: boolean;
  setStateTimeout?: number;
}

export class Store<StoreState> {
  public components = [];
  public readonly id: string;
  private eventManager: StoreEventManager<StoreState> | null = null;
  private readonly initialState: StoreState = null;
  private frozenState: StoreState = null;

  private opts: StoreOptions = {
    /**
     * @deprecated since 3.x
     */
    live: false,
    /**
     * @deprecated since 3.x
     */
    freezeInstances: false,
    mutable: false,
    persistence: false,
    setStateTimeout: 0,
  };

  get state(): StoreState {
    return this.frozenState;
  }

  constructor(
    initialState: StoreState,
    options?: StoreOptions,
    readonly persistenceDriver?: StorePersistentDriver<StoreState>,
  ) {
    let currentState: StoreState | null = null;

    this.id = this.generateStoreId(initialState);

    if (options) {
      this.opts.freezeInstances = options.freezeInstances === true;
      this.opts.mutable = options.mutable === true;
      this.opts.persistence = options.persistence === true;
      this.opts.setStateTimeout = options.setStateTimeout;
    }

    if (!this.persistenceDriver) {
      this.persistenceDriver = new StorePersistentLocalStorageDriver(this.id);
    }

    if (this.opts.persistence) {
      const persistentState = this.persistenceDriver.read().data;

      if (persistentState) {
        currentState = persistentState;
      }
    }

    if (currentState === null) {
      currentState = initialState;
    }

    this.persistenceDriver.persistence = this.opts.persistence;
    this.persistenceDriver.initialState = initialState;
    this.eventManager = new StoreEventManager(this.opts.setStateTimeout);
    this.initialState = this.deepFreeze(initialState);
    this.frozenState = this.deepFreeze(currentState);
  }

  deepFreeze(obj: any): any {
    if (this.opts.mutable) {
      return obj;
    } else {
      const propNames = Object.getOwnPropertyNames(obj);

      for (const key in propNames) {
        const prop = obj[propNames[key]];

        if (typeof prop === 'object' && prop !== null) {
          this.deepFreeze(prop);
        }
      }

      return Object.freeze(obj);
    }
  }

  private hashCode(str: string): string {
    let h = 0;

    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }

    return h.toString(16);
  }

  private generateStoreId(state: StoreState): string {
    let flatKeys: string = '';

    for (let key in state) {
      flatKeys += key;
    }

    return this.hashCode(flatKeys);
  }

  public resetPersistence() {
    this.persistenceDriver.reset();
  }

  public resetDumpHistory() {
    this.persistenceDriver.resetHistory();
    this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState, this.frozenState);
  }

  public saveDump(): number {
    const timestamp = this.persistenceDriver.saveDump(this.persistenceDriver.pack(this.frozenState));
    this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState, this.frozenState);

    return timestamp;
  }

  public removeDump(timestamp: number) {
    this.persistenceDriver.removeDump(timestamp);
    this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState, this.frozenState);
  }

  public restoreDump(timestamp: number) {
    const pack = this.persistenceDriver.readDump(timestamp);

    if (pack) {
      const prevState = this.deepFreeze(this.frozenState);
      this.setState(pack.data);
      this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState, prevState);
    }
  }

  public getDumpHistory(): number[] {
    return this.persistenceDriver.getDumpHistory();
  }

  public setState(newState: Partial<StoreState>) {
    const prevState = this.deepFreeze(this.frozenState);
    const updatedState = this.deepFreeze({ ...prevState, ...newState });

    this.update(updatedState, prevState);
    this.persistenceDriver.write(this.persistenceDriver.pack(updatedState));
    this.frozenState = updatedState;
  }

  public resetState() {
    this.setState(this.deepFreeze(this.initialState));
  }

  public update(currentState: StoreState, prevState: StoreState) {
    for (const key in this.components) {
      if (this.components[key].isStoreMounted) {
        this.components[key].storeComponentStoreWillUpdate();
        this.components[key].forceUpdate();
        this.components[key].storeComponentStoreDidUpdate();
      }
    }

    for (const key in this.components) {
      if (this.components[key].isStoreMounted) {
        this.components[key].storeComponentStoreWillUpdate();
        this.components[key].forceUpdate();
        this.components[key].storeComponentStoreDidUpdate();
      }
    }

    this.eventManager.fire(StoreEventType.Update, currentState, prevState);
  }

  public getInitialState(): StoreState {
    return this.initialState;
  }

  public on(
    eventType: StoreEventType | StoreEventType[],
    callback: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void,
  ): StoreEvent<StoreState> {
    const eventTypes: StoreEventType[] =
      eventType && eventType.constructor === Array
        ? (eventType as StoreEventType[])
        : ([eventType] as StoreEventType[]);
    const event = this.eventManager.add(eventTypes, callback);

    this.eventManager.fire(StoreEventType.Init, this.frozenState, this.frozenState, event);
    this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState, this.frozenState, event);

    return event;
  }
}
