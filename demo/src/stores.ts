import { Store, StorePersistentLocalStorageDriver, StoreEventType } from '../../src';

export interface StoreState {
  counter: number;
  foo: string;
}

export enum EPage {
  Components = 'Components',
  Persistent = 'Persistent',
  Snapshots = 'Snapshots',
  Performance = 'Performance',
  Optimization = 'Optimization',
  Isolated = 'Isolated',
}

const initialStoreState: StoreState = {
  counter: 0,
  foo: 'foo',
};

export const stores = new Store<StoreState>(initialStoreState, {
  live: true,
  name: 'JustStore',
});

stores.on(StoreEventType.All, console.log);

export const persistentStore = new Store<StoreState>(
  initialStoreState,
  {
    live: true,
    persistence: true,
    name: 'Persistent',
  },
  new StorePersistentLocalStorageDriver('demo'),
);

export const historyStore = new Store<StoreState>(
  initialStoreState,
  {
    live: true,
    persistence: true,
    name: 'History',
  },
  new StorePersistentLocalStorageDriver('demoHistory'),
);

export const pageStore = new Store<{ page: EPage }>(
  {
    page: EPage.Components,
  },
  {
    name: 'Page',
    persistence: false,
  },
);
