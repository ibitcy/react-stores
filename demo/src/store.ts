import { Store, StorePersistentLocalStorageDriver } from '../../src';

export interface StoreState {
  counter: number;
  foo: string;
}

const initialState: StoreState = {
  counter: 0,
  foo: 'foo',
};

export const store = new Store<StoreState>(initialState, {
  live: true,
});

export const persistentStore = new Store<StoreState>(
  initialState,
  {
    live: true,
    persistence: true,
  },
  new StorePersistentLocalStorageDriver('demo'),
);

export const historyStore = new Store<StoreState>(
  initialState,
  {
    live: true,
    persistence: true,
  },
  new StorePersistentLocalStorageDriver('demoHistory'),
);
