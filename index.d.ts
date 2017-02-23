import * as React from 'react';
export declare abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    stores: StoreState;
    private isStoreMounted;
    abstract storeComponentDidMount(): void;
    abstract storeComponentWillUnmount(): void;
    abstract storeComponentWillReceiveProps(nextProps: Props): void;
    abstract storeComponentWillUpdate(nextProps: Props, nextState: State): void;
    abstract storeComponentDidUpdate(prevProps: Props, prevState: State): void;
    constructor(stores: StoreState);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentWillUpdate(nextProps: Props, nextState: State): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
}
export declare class Store<StoreState> {
    components: any[];
    state: StoreState;
    constructor(state: StoreState);
    setState(newState: StoreState): void;
    private update();
}
