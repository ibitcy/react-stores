/// <reference types="react" />
import * as React from 'react';
export declare abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    readonly stores: StoreState;
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
    private stateImmutable;
    private initialStateImmutable;
    private eventManager;
    constructor(state: StoreState);
    setState(newState: StoreState): void;
    resetState(): void;
    update(): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType, callback: (storeState: StoreState) => void): StoreEvent<StoreState>;
}
export declare enum StoreEventType {
    storeUpdated = "storeUpdated",
}
export declare class StoreEvent<StoreState> {
    readonly id: string;
    readonly type: StoreEventType;
    readonly onFire: (storeState: StoreState) => void;
    readonly onRemove: (id: string) => void;
    constructor(id: string, type: StoreEventType, onFire: (storeState: StoreState) => void, onRemove: (id: string) => void);
    remove(): void;
}
