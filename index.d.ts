/// <reference types="react" />
import * as React from 'react';
export declare abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    stores: StoreState;
    private isStoreMounted;
    abstract storeComponentDidMount(): void;
    abstract storeComponentWillUnmount(): void;
    constructor(stores: StoreState);
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export declare class Store<StoreState> {
    components: any[];
    state: StoreState;
    constructor(state: StoreState);
    setState(newState: StoreState): void;
    private update();
}
