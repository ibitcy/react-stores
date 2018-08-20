import { Store } from "../../src/store";
export interface StoreState {
    counter: number;
    foo: string;
}
export declare const store: Store<StoreState>;
export declare const storePersistent: Store<StoreState>;
