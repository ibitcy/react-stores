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
export interface StoreOptions {
    live?: boolean;
    freezeInstances?: boolean;
    mutable?: boolean;
}
export declare class Store<StoreState> {
    components: any[];
    private eventManager;
    private readonly frozenState;
    private readonly initialState;
    constructor(state: StoreState, options?: StoreOptions);
    readonly state: StoreState;
    setState(newState: Partial<StoreState>): void;
    resetState(): void;
    update(currentState: StoreState, prevState: StoreState): void;
    getInitialState(): StoreState;
    on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void): StoreEvent<StoreState>;
}
export declare type StoreEventType = 'all' | 'init' | 'update';
export declare class StoreEvent<StoreState> {
    readonly id: string;
    readonly types: StoreEventType[];
    readonly onFire: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void;
    readonly onRemove: (id: string) => void;
    constructor(id: string, types: StoreEventType[], onFire: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void, onRemove: (id: string) => void);
    remove(): void;
}
export declare const followStore: <StoreState>(store: Store<StoreState>, followStates?: string[]) => (WrappedComponent: React.ComponentClass<{}>) => any;
