import * as React from 'react';
import { StoreEvent } from '../../src/store';
import { StoreState } from './store';
interface Props {
}
interface State {
    commonStoreState: StoreState;
}
export declare class CounterEvents extends React.Component<Props, State> {
    event: StoreEvent<StoreState>;
    state: State;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
