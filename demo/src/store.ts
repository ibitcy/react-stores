import { Store } from '../../src/store';

export namespace CommonStore {
    // State interface
    export interface State {
        nullObj: null
        counter: number
        foo: string
        numericArray: number[],
        objectsArray: Object[],
        settings: {
            foo: {
                bar: number
            },
            baz: number
        }
    }

    // Store's state initial values
    export const initialState: State = Object.freeze({
        nullObj: null,
        counter: 0,
        foo: 'foo',
        numericArray: [1, 2, 3],
        objectsArray: [{
            a: 1,
            b: 2,
            c: 3
        },
        {
            a: 3,
            b: 2,
            c: {
                a: 1,
                b: [1, 2, 3]
            },
            d: [
                {id: 1, name: 'test 1', enabled: true},
                {id: 2, name: 'test 2', enabled: false}
            ]
        }],
        settings: {
            foo: {
                bar: 1
            },
            baz: 2
        }
    });

    export let store: Store<State> = new Store<State>(initialState, {
        live: true,
    });
}