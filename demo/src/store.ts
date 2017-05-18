import {Store} from '../../src/store';
 
export namespace CommonStore {
    // State interface
    export interface State {
        counter: number,
        foo: string
    }
 
    // Store's state initial values
    const initialState: State = {
        counter: 0,
        foo: 'foo'
    };
 
    export let store: Store<State> = new Store<State>(initialState);
}