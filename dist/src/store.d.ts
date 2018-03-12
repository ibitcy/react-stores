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
    private eventManager;
    constructor(state: StoreState);
    private mergeStates(state1, state2);
    setState(newState: StoreState): void;
    resetState(): void;
    update(): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState) => void): StoreEvent<StoreState>;
}
export declare type StoreEventType = 'all' | 'init' | 'update';
export declare class StoreEvent<StoreState> {
    readonly id: string;
    readonly types: StoreEventType[];
    readonly onFire: (storeState: StoreState, type?: StoreEventType) => void;
    readonly onRemove: (id: string) => void;
    constructor(id: string, types: StoreEventType[], onFire: (storeState: StoreState, type?: StoreEventType) => void, onRemove: (id: string) => void);
    remove(): void;
}
export declare const followStore: (store: Store<any>) => (WrappedComponent: React.ComponentClass<{}>) => any;
