import {Store, StorePersistentLocalStorageDriver} from '../../lib';

export interface StoreState {
  counter: number;
  foo: string;
}

const initialState: StoreState = {
  counter: 0,
  foo: 'foo',
};

export const store: Store<StoreState> = new Store<StoreState>(initialState, {
  live: true,
});

export const storePersistent: Store<StoreState> = new Store<StoreState>(
  initialState,
  {
    live: true,
    persistence: true,
  },
  new StorePersistentLocalStorageDriver('demo'),
);

export const storeHistory: Store<StoreState> = new Store<StoreState>(
  initialState,
  {
    live: true,
    persistence: true,
  },
  new StorePersistentLocalStorageDriver('demoHistory'),
);
