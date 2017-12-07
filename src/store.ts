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
    private initialState: StoreState = null;

    constructor(state: StoreState) {
        this.state = this.copyState(state);
        this.initialState = this.copyState(state);
    }

    private copyState(state: StoreState): StoreState {
        return (<any>Object).assign({}, this.state);
    }

    private compareObject(obj1: Object, obj2: Object): boolean {
        return JSON.stringify(obj1) === JSON.stringify(obj2);  
    }

    private check(property1: any, property2: any): boolean {
        if(property1 === null && (property1 !== property2)) {
            return false;
        } else if(property1 === null && (property1 === property2)) {
            return true;
        } else {
            switch (property1.constructor) {
                case Array :
                case Object :
                case Function : {
                    return JSON.stringify(property1) === JSON.stringify(property2);
                }
                case Number :
                case String : 
                case Boolean : 
                default : {
                    return property1 === property2;
                }
            }
        }
    }

    public setState(newState: StoreState): void {
        let prevStateCopy: StoreState = this.copyState(this.state);
        let nextStateCopy: StoreState = null;
        let updated: boolean = false;

        for (let property in newState) {
            if (newState.hasOwnProperty(property) && this.state.hasOwnProperty(property)) {
                if (!this.check(this.state[property], newState[property])) {
                    this.state[property] = newState[property];
                    updated = true;
                }
            }
        }

        if (updated) {
            nextStateCopy = this.copyState(this.state);
            this.update(prevStateCopy, nextStateCopy);
        }
    }

    public resetState(): void {
        this.setState(this.initialState);
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