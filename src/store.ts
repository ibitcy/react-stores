import * as React from 'react';

export abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
    public stores: StoreState = {} as StoreState;
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

    constructor(state: StoreState) {
        this.state = state;
    }

    public setState(newState: StoreState): void {
        let updated: boolean = false;
        let prevStateCopy: StoreState = (<any>Object).assign({}, this.state);
        let nextStateCopy: StoreState = null;

        for (let property in newState) {
            if (newState.hasOwnProperty(property) && this.state.hasOwnProperty(property)) {
                if (this.state[property] !== newState[property]) {
                    this.state[property] = newState[property];
                    updated = true;
                }
            }
        }

        if (updated) {
            nextStateCopy = (<any>Object).assign({}, this.state);
            this.update(prevStateCopy, nextStateCopy);
        }
    }

    private update(prevStateCopy: StoreState, nextStateCopy: StoreState): void {
        this.components.forEach((component) => {
            if (component.isStoreMounted) {
                component.storeComponentStoreWillUpdate();
                component.forceUpdate();
                component.storeComponentStoreDidUpdate();
            }
        });
    }
}