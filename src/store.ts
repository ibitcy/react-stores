import * as React from 'react';
import { Map, List } from 'immutable';

export enum StoreEvents {
    storeUpdated = 'storeUpdatd'
}

export abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    public readonly stores: StoreState = {} as StoreState;
    private isStoreMounted: boolean = false;

    public storeComponentDidMount(): void {

    }

    public storeComponentWillUnmount(): void {

    }

    public storeComponentWillReceiveProps(nextProps: Props): void {

    }

    public storeComponentWillUpdate(nextProps: Props, nextState: State): void {

    }

    public storeComponentDidUpdate(prevProps: Props, prevState: State): void {

    }

    public shouldStoreComponentUpdate(nextProps: Props, nextState: State): boolean {
        return true;
    }

    public storeComponentStoreWillUpdate(): void {

    }

    public storeComponentStoreDidUpdate(): void {

    }

    constructor(stores: StoreState) {
        super();

        this.stores = stores;

        for (let storeObject in this.stores) {
            if (this.stores.hasOwnProperty(storeObject)) {
                let store: any = this.stores[storeObject];
                store.components.push(this);
            }
        }
    }

    public componentDidMount(): void {
        this.isStoreMounted = true;
        this.storeComponentDidMount();
    }

    public componentWillUnmount(): void {
        this.isStoreMounted = false;
        this.storeComponentWillUnmount();
    }

    public componentWillReceiveProps(nextProps: Props): void {
        this.storeComponentWillReceiveProps(nextProps);
    }

    public componentWillUpdate(nextProps: Props, nextState: State): void {
        this.storeComponentWillUpdate(nextProps, nextState);
    }

    public componentDidUpdate(prevProps: Props, prevState: State): void {
        this.storeComponentDidUpdate(prevProps, prevState);
    }

    public shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.shouldStoreComponentUpdate(nextProps, nextState);
    }
}

export class Store<StoreState> {
    public components = [];
    public state: StoreState = null;
    private stateImmutable = null;
    private initialStateImmutable = null;

    constructor(state: StoreState) {
        this.stateImmutable = Map(state);
        this.initialStateImmutable = Map(state);
        this.state = this.stateImmutable.toJS();
    }

    public setState(newState: StoreState): void {
        let newStatImmutable = this.stateImmutable.mergeDeep(newState);

        if (!newStatImmutable.equals(this.stateImmutable)) {
            this.stateImmutable = newStatImmutable;
            this.state = this.stateImmutable.toJS();
            this.update();
        }
    }

    public resetState(): void {
        this.stateImmutable = Map(this.initialStateImmutable);
        this.state = this.stateImmutable.toJS();
        this.update();
    }

    public update(): void {
        this.components.forEach((component) => {
            if (component.isStoreMounted) {
                component.storeComponentStoreWillUpdate();
                component.forceUpdate();
                component.storeComponentStoreDidUpdate();
            }
        });
    }

    public getInitialState(): StoreState {
        return this.initialStateImmutable.toJS();
    }

    public on(event: StoreEvents): void {
        
    }
}