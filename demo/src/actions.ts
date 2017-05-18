import { CommonStore } from './store';

export class CommonActions {
    static increaseCounter(): void {
        let newState: CommonStore.State = {
            counter: CommonStore.store.state.counter + 1
        } as CommonStore.State;

        CommonStore.store.setState(newState);
    }

    static toggleFooBar(): void {
        let newState: CommonStore.State = {
            foo: (CommonStore.store.state.foo === 'foo') ? 'bar' : 'foo'
        } as CommonStore.State;

        CommonStore.store.setState(newState);
    }
}
