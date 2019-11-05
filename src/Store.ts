import * as Freezer from 'freezer-js';
import { StorePersistentDriver } from './StorePersistentDriver';
import { StorePersistentLocalStorageDriver } from './StorePersistentLocalStorageDriver';
import { StoreEventManager } from './StoreEventManager';
import { StoreEventType, StoreEvent } from './StoreEvent';

export interface StoreOptions {
  live?: boolean;
  persistence?: boolean;
  freezeInstances?: boolean;
  mutable?: boolean;
  setStateTimeout?: number;
}

export class Store<StoreState> {
  public components = [];
  public readonly id: string;
  private eventManager: StoreEventManager<StoreState> | null = null;
  private readonly frozenState = null;
  private readonly initialState = null;

  private opts: StoreOptions = {
    live: false,
    freezeInstances: false,
    mutable: false,
    persistence: false,
    setStateTimeout: 0,
  };

  constructor(
    initialState: StoreState,
    options?: StoreOptions,
    readonly persistenceDriver?: StorePersistentDriver<StoreState>,
  ) {
    let currentState = null;

    this.id = this.generateStoreName(initialState);

    console.log(this.id);

    if (options) {
      this.opts.persistence = options.persistence === true;
      this.opts.live = options.live === true;
      this.opts.freezeInstances = options.freezeInstances === true;
      this.opts.mutable = options.mutable === true;
      this.opts['singleParent'] = true;
      this.opts.setStateTimeout = options.setStateTimeout;
    }

    if (!this.persistenceDriver) {
      this.persistenceDriver = new StorePersistentLocalStorageDriver(this.id);
    }

    this.persistenceDriver.persistence = this.opts.persistence;
    this.persistenceDriver.initialState = initialState;

    const persistentState = this.persistenceDriver.read().data;

    if (persistentState) {
      currentState = persistentState;
    }

    if (currentState === null) {
      currentState = initialState;
    }

    this.eventManager = new StoreEventManager(this.opts.setStateTimeout);
    this.initialState = new Freezer({ state: initialState });
    this.frozenState = new Freezer({ state: currentState }, this.opts);
    this.frozenState.on('update', (currentState, prevState) => {
      this.update(currentState.state, prevState.state);
      this.persistenceDriver.write(this.persistenceDriver.pack(currentState.state));
    });
  }

  get state(): StoreState {
    return this.frozenState.get().state;
  }

  private hashCode(str: string): string {
    let h = 0;

    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }

    return h.toString(16);
  }

  private generateStoreName(state: StoreState): string {
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
    this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState.get().state, this.frozenState.get().state);
  }

  public saveDump(): number {
    const timestamp = this.persistenceDriver.saveDump(this.persistenceDriver.pack(this.frozenState.get().state));
    this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState.get().state, this.frozenState.get().state);

    return timestamp;
  }

  public removeDump(timestamp: number) {
    this.persistenceDriver.removeDump(timestamp);
    this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState.get().state, this.frozenState.get().state);
  }

  public restoreDump(timestamp: number) {
    const pack = this.persistenceDriver.readDump(timestamp);

    if (pack) {
      this.setState(pack.data);
      this.eventManager.fire(StoreEventType.DumpUpdate, this.frozenState.get().state, this.frozenState.get().state);
    }
  }

  public getDumpHistory(): number[] {
    return this.persistenceDriver.getDumpHistory();
  }

  public setState(newState: Partial<StoreState>) {
    const newFrozenState = new Freezer(newState);
    const mergedState = { ...this.frozenState.get().state };

    for (const key in newState) {
      const newFrozenProp = newFrozenState.get()[key];

      if (newFrozenProp !== mergedState[key]) {
        mergedState[key] = newFrozenProp;
      }
    }

    this.frozenState.get().state.set(mergedState);
  }

  public resetState() {
    this.setState(this.initialState.get().state);
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
    return this.initialState.get().state;
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

    this.eventManager.fire(StoreEventType.Init, this.frozenState.get().state, this.frozenState.get().state, event);
    this.eventManager.fire(
      StoreEventType.DumpUpdate,
      this.frozenState.get().state,
      this.frozenState.get().state,
      event,
    );

    return event;
  }
}
