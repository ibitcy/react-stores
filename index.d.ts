/// <reference types="react" />
import * as React from 'react';
export declare abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    stores: StoreState;
    private isStoreMounted;
    storeComponentDidMount(): void;
    storeComponentWillUnmount(): void;
    storeComponentWillReceiveProps(nextProps: Props): void;
    storeComponentWillUpdate(nextProps: Props, nextState: State): void;
    storeComponentDidUpdate(prevProps: Props, prevState: State): void;
    shouldStoreComponentUpdate(nextProps: Props, nextState: State): boolean;
    storeComponentStoreWillUpdate(): void;
    storeComponentStoreDidUpdate(): void;
    constructor(stores: StoreState);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentWillUpdate(nextProps: Props, nextState: State): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean;
}
export declare class Store<StoreState> {
    components: any[];
    state: StoreState;
    private initialState;
    constructor(state: StoreState);
    private copyState(state);
    private check(property1, property2);
    setState(newState: StoreState): void;
    resetState(): void;
    update(): void;
}
