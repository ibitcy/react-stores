import { Store } from '../../src/store';
export declare namespace CommonStore {
    interface State {
        counter: number;
        foo: string;
        settings: {
            foo: {
                bar: number;
            };
            baz: number;
        };
    }
    let store: Store<State>;
}
