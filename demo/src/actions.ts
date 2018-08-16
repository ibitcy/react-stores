import { CommonStore } from './store';

export class CommonActions {
    public static increaseCounter(): void {
        CommonStore.store.setState({
            counter: CommonStore.store.state.counter + 1
        });
    }

    public static toggleFooBar(): void {
        let newState: CommonStore.State = {
            foo: (CommonStore.store.state.foo === 'foo') ? 'bar' : 'foo'
        } as CommonStore.State;

        CommonStore.store.setState(newState);
    }

    public static reset(): void {
        CommonStore.store.resetState();
    }

    public static setSettings(bar: number, baz: number): void {
        CommonStore.store.setState({
            settings: {
                foo: {
                    bar: bar
                },
                baz: baz
            }
        } as CommonStore.State);
    }

    public static setNull(obj: null) {
        CommonStore.store.setState({
            nullObj: obj
        } as CommonStore.State);
    }
}
