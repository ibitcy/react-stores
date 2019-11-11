// myStore.ts
import { Store } from '../lib';

export interface IMyStoreState {
  counter: number;
}

export const myStore = new Store<IMyStoreState>({
  counter: 0, // initial state values
});
