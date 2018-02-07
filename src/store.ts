import * as React from 'react';
import { Map, List } from 'immutable';

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
        if(this.stores) {
            for (let storeObject in this.stores) {
                if (this.stores.hasOwnProperty(storeObject)) {
                    const store: any = this.stores[storeObject];
                    const newComponents = [];
                    
                    store.components.forEach((component) => {
                        if(component !== this) {
                            newComponents.push(component);
                        }
                    });

                    store.components = newComponents;
                }
            }
        }

        this.stores = null;
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
    private eventManager: StoreEventManager<StoreState> = null;

    constructor(state: StoreState) {
        this.eventManager = new StoreEventManager();
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

        this.eventManager.fire(StoreEventType.storeUpdated, this.stateImmutable.toJS());
    }

    public getInitialState(): StoreState {
        return this.initialStateImmutable.toJS();
    }

    public on(eventType: StoreEventType, callback: (storeState: StoreState) => void): StoreEvent<StoreState> {
        const event: StoreEvent<StoreState> = this.eventManager.add(eventType, callback);
        this.eventManager.fire(eventType, this.state);
        return event;
    }
}

export enum StoreEventType {
    storeUpdated = 'storeUpdated'
}

export class StoreEvent<StoreState> {
    constructor(
        readonly id: string,
        readonly type: StoreEventType,
        readonly onFire: (storeState: StoreState) => void,
        readonly onRemove: (id: string) => void
    ) { }

    public remove(): void {
        this.onRemove(this.id);
    }
}

class StoreEventManager<StoreState> {
    private events: StoreEvent<StoreState>[] = [];
    private eventCounter: number = 0;

    private generateEventId(): string {
        return `${++this.eventCounter}${Date.now()}${Math.random()}`;
    }

    public fire(type: StoreEventType, storeState: StoreState): void {
        this.events.forEach((event: StoreEvent<StoreState>) => {
            if (event.type === type) {
                event.onFire(storeState);
            }
        });
    }

    public remove(id: string): void {
        this.events = this.events.filter((event: StoreEvent<StoreState>) => {
            return event.id !== id;
        });
    }

    public add(eventType: StoreEventType, callback: (storeState: StoreState) => void): StoreEvent<StoreState> {
        const event: StoreEvent<StoreState> = new StoreEvent<StoreState>(
            this.generateEventId(),
            eventType,
            callback,
            (id: string) => {
                this.remove(id);
            }
        );

        this.events.push(event);

        return event;
    }
}