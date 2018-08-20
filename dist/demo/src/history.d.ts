import * as React from 'react';
import { StoreState } from './store';
import { StoreEvent } from '../../src/store';
interface Props {
}
interface State {
    commonStoreState: StoreState;
    dumpHistory: number[];
    counter: number;
}
export declare class History extends React.Component<Props, State> {
    event: StoreEvent<StoreState>;
    state: State;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private restore;
    private delete;
    render(): JSX.Element;
}
export {};
