/// <reference types="react" />
import { Store, StoreComponent } from '../../src/store';
import { StoreState } from './store';
interface Props {
}
interface State {
}
interface StoresState {
    common: Store<StoreState>;
}
export declare class Counter extends StoreComponent<Props, State, StoresState> {
    constructor(props: Props);
    render(): JSX.Element;
}
export {};
