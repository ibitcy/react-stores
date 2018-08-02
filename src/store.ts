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
        if (this.stores) {
            for (let storeObject in this.stores) {
                if (this.stores.hasOwnProperty(storeObject)) {
                    const store: any = this.stores[storeObject];
                    const newComponents = [];

                    store.components.forEach((component) => {
                        if (component !== this) {
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
	private prevState: StoreState = null;
    private eventManager: StoreEventManager<StoreState> = null;
    private readonly initialState = null;

    constructor(state: StoreState) {
        this.eventManager = new StoreEventManager();
        this.initialState = this.mergeStates(state, {});
        this.state = this.mergeStates(state, {});
    }

    private mergeStates(state1: Object, state2: Object): StoreState {
        return { ...{}, ...state1, ...state2 } as StoreState;
    }

    public setState(newState: Partial<StoreState>): void {
        let merged: StoreState = this.mergeStates(this.state, newState);
	    this.prevState = this.mergeStates(this.state, {});

        try {
            if (JSON.stringify(this.state) !== JSON.stringify(merged)) {
                this.state = merged;
                this.update();
            }
        } catch(err) {
            this.state = merged;
            this.update();
        }
    }

    public resetState(): void {
        this.state = this.initialState;
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

        this.eventManager.fire('update', this.mergeStates(this.state, {}), this.prevState);
    }

    public getInitialState(): StoreState {
        return this.mergeStates(this.initialState, {});
    }

    public on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState, type?: StoreEventType) => void): StoreEvent<StoreState> {
        const eventTypes: StoreEventType[] = eventType && eventType.constructor === Array ? eventType as StoreEventType[] : [eventType] as StoreEventType[];
        const event: StoreEvent<StoreState> = this.eventManager.add(eventTypes, callback);

        this.eventManager.fire('init', this.mergeStates(this.state, {}), this.state);

        return event;
    }
}

export type StoreEventType =
	'all' |
	'init' |
	'update' ;

export class StoreEvent<StoreState> {
    constructor(
        readonly id: string,
        readonly types: StoreEventType[],
        readonly onFire: (storeState: StoreState, prevStoreState?: StoreState, type?: StoreEventType) => void,
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

    public fire(type: StoreEventType, storeState: StoreState, prevStoreState: StoreState): void {
        this.events.forEach((event: StoreEvent<StoreState>) => {
            if (event.types.indexOf(type) >= 0 || event.types.indexOf('all') >= 0) {
                event.onFire(storeState, prevStoreState, type);
            }
        });
    }

    public remove(id: string): void {
        this.events = this.events.filter((event: StoreEvent<StoreState>) => {
            return event.id !== id;
        });
    }

    public add(eventTypes: StoreEventType[], callback: (storeState: StoreState) => void): StoreEvent<StoreState> {
        const event: StoreEvent<StoreState> = new StoreEvent<StoreState>(
            this.generateEventId(),
            eventTypes,
            callback,
            (id: string) => {
                this.remove(id);
            }
        );

        this.events.push(event);

        return event;
    }
}

export const followStore = (store: Store<any>, followStates?: string[]) => (WrappedComponent: React.ComponentClass): any => {
	class Component extends React.Component {
		private storeEvent: StoreEvent<any> = null;

		state = {
			storeState: null
		};

		componentWillMount() {
			this.storeEvent = store.on('all', (storeState: any, prevStoreState: any) => {
				if(followStates && followStates.length > 0){
					let update: boolean = false;

					for(const prop of followStates){
						if(storeState.hasOwnProperty(prop) && (JSON.stringify(storeState[prop]) !== JSON.stringify(prevStoreState[prop]))){
							update = true;
						}
					}

					if(update){
						this.forceUpdate();
					}
				} else {
					this.forceUpdate();
				}
			});
		}

		componentWillUnmount() {
			this.storeEvent.remove();
		}

		public render() {
			return React.createElement(WrappedComponent, this.props);
		}
	}

	return Component;
};
