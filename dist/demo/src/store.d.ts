import { Store } from '../../src/store';
export declare namespace CommonStore {
    interface State {
        counter: number;
        foo: string;
    }
    let store: Store<State>;
}
