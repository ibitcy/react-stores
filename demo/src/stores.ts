import { Store, StorePersistentLocalStorageDriver } from '../../src';

export interface StoreState {
  counter: number;
  foo: string;
}

export enum EPage {
  Components = 'Components',
  Persistent = 'Persistent',
  Snapshots = 'Snapshots',
  Performance = 'Performance',
  Optimisation = 'Optimisation',
}

const initialStoreState: StoreState = {
  counter: 0,
  foo: 'foo',
};

export const stores = new Store<StoreState>(initialStoreState, {
  live: true,
});

export const persistentStore = new Store<StoreState>(
  initialStoreState,
  {
    live: true,
    persistence: true,
  },
  new StorePersistentLocalStorageDriver('demo'),
);

export const historyStore = new Store<StoreState>(
  initialStoreState,
  {
    live: true,
    persistence: true,
  },
  new StorePersistentLocalStorageDriver('demoHistory'),
);

export const pageStore = new Store<{ page: EPage }>(
  {
    page: EPage.Components,
  },
  {
    persistence: false,
  },
);
