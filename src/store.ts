import * as React from 'react';
import * as Freezer from 'freezer-js';
import * as objectHash from 'object-hash';

export interface StorePersistantDump<StoreState> {
	dumpHistory: StorePersistantPacket<StoreState>[];
}

export interface StorePersistantPacket<StoreState> {
	data: StoreState;
	timestamp: number;
}

export abstract class StorePersistantDriver<StoreState> {
	public persistence: boolean = true;

	constructor(
		readonly name: string,
		readonly lifetime: number = Infinity,
	) {

	}

	public initialState: StoreState = null;
	public abstract type: string;
	public abstract write(pack: StorePersistantPacket<StoreState>): void;
	public abstract read(): StorePersistantPacket<StoreState>;
	public abstract saveDump(pack: StorePersistantPacket<StoreState>): number;
	public abstract readDump(id: number): StorePersistantPacket<StoreState>;
	public abstract resetHistory(): void;
	public abstract getDumpHistory(): number[];
	public abstract removeDump(timestamp: number): void;

	public pack(data: StoreState): StorePersistantPacket<StoreState> {
		return {
			data: data,
			timestamp: Date.now(),
		}
	}

	public reset(): StorePersistantPacket<StoreState> {
		const pack = this.pack(this.initialState);
		this.write(pack);
		return pack;
	}

	public get storeName(): string {
		return `store.persistent.${this.type}.${this.name}`.toLowerCase();
	}

	public get dumpHystoryName(): string {
		return `store.persistent.dump.history.${this.type}.${this.name}`.toLowerCase();
	}
}

export class StorePersistentLocalSrorageDriver<StoreState> extends StorePersistantDriver<StoreState> {
	private storage = null;
	public type: string = 'localStorage';

	constructor(
		readonly name: string,
		readonly lifetime: number = Infinity,
	) {
		super(name, lifetime);

		if (typeof window !== 'undefined' && window.localStorage) {
			this.storage = window.localStorage;
		}
	}

	public write(pack: StorePersistantPacket<StoreState>): void {
		if (this.storage && this.persistence) {
			try {
				this.storage.setItem(this.storeName, JSON.stringify(pack));
			} catch (e) {
				console.error(e);
			}
		}
	}

	public read(): StorePersistantPacket<StoreState> {
		if (this.storage && this.persistence) {
			let dump = null;

			try {
				dump = JSON.parse(this.storage.getItem(this.storeName));

				if (!Boolean(dump) && !Boolean(dump.timestamp)) {
					dump = this.reset();
				}
			} catch (e) {
				dump = this.reset();
			}

			return dump;
		} else {
			return this.reset();
		}
	}

	public saveDump(pack: StorePersistantPacket<StoreState>): number {
		let timestamp: number = pack.timestamp;

		if (this.storage && this.persistence) {
			try {
				const dumpHistory: StorePersistantDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHystoryName));

				if (dumpHistory && dumpHistory.dumpHistory) {
					dumpHistory.dumpHistory.push(pack);

					this.storage.setItem(this.dumpHystoryName, JSON.stringify(dumpHistory));
				} else {
					this.storage.setItem(this.dumpHystoryName, JSON.stringify({
						dumpHistory: [pack],
					}));
				}
			} catch (e) {
				try {
					this.storage.setItem(this.dumpHystoryName, JSON.stringify({
						dumpHistory: [pack],
					}));
				} catch (e) {
					console.error(e);
					timestamp = null;
				}

				console.error(e);
				timestamp = null;
			}
		}

		return timestamp;
	}

	public removeDump(timestamp: number): void {
		if (this.storage && this.persistence) {
			try {
				const dumpHistory: StorePersistantDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHystoryName));

				if (dumpHistory && dumpHistory.dumpHistory) {
					const newDumpHistory: StorePersistantPacket<StoreState>[] = dumpHistory.dumpHistory.filter((dump: StorePersistantPacket<StoreState>) => dump.timestamp !== timestamp);

					this.storage.setItem(this.dumpHystoryName, JSON.stringify({
						dumpHistory: newDumpHistory,
					}));
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	public readDump(timestamp: number): StorePersistantPacket<StoreState> {
		let dump: StorePersistantPacket<StoreState> = null;

		if (this.storage && this.persistence) {
			try {
				const dumpHistory: StorePersistantDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHystoryName));

				if (dumpHistory && dumpHistory.dumpHistory) {
					dump = dumpHistory.dumpHistory.find((pack) => pack.timestamp === timestamp);
				} else {
					dump = null;
				}
			} catch (e) {
				console.error(e);
			}
		}

		return dump;
	}

	public getDumpHistory(): number[] {
		let history: number[] = [];

		if (this.storage && this.persistence) {
			try {
				const dumpHistory: StorePersistantDump<StoreState> = JSON.parse(this.storage.getItem(this.dumpHystoryName));
				history = dumpHistory.dumpHistory.map((pack: StorePersistantPacket<StoreState>) => pack.timestamp);
			} catch (e) {
				console.error(e);
				history = [];
			}
		}

		return history;
	}

	public resetHistory(): void {
		if (this.storage && this.persistence) {
			try {
				this.storage.setItem(this.dumpHystoryName, JSON.stringify({
					dumpHistory: [],
				}));
			} catch (e) {
				console.error(e);
			}
		}
	}
}

export abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
	public stores: Partial<StoreState> = {};
	private isStoreMounted: boolean = false;

	constructor(props: Props, stores: StoreState) {
		super(props);

		this.stores = stores;

		for (let storeObject in this.stores) {
			if (this.stores.hasOwnProperty(storeObject)) {
				let store: any = this.stores[storeObject];
				store.components.push(this);
			}
		}
	}

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

export interface StoreOptions {
	live?: boolean;
	persistence?: boolean;
	freezeInstances?: boolean;
	mutable?: boolean;
}

export class Store<StoreState> {
	public components = [];
	public readonly id: string;
	private eventManager: StoreEventManager<StoreState> = null;
	private readonly frozenState = null;
	private readonly initialState = null;

	private opts: StoreOptions = {
		live: false,
		freezeInstances: false,
		mutable: false,
		persistence: false,
	};

	constructor(initialState: StoreState, options?: StoreOptions, readonly persistenceDriver?: StorePersistantDriver<StoreState>) {
		let currentState = null;

		this.id = this.generateStoreName(initialState);

		if (options) {
			this.opts.persistence = options.persistence === true;
			this.opts.live = options.live === true;
			this.opts.freezeInstances = options.freezeInstances === true;
			this.opts.mutable = options.mutable === true;
			this.opts['singleParent'] = true;
		}

		if (!this.persistenceDriver) {
			this.persistenceDriver = new StorePersistentLocalSrorageDriver(this.id);
		}

		this.persistenceDriver.persistence = this.opts.persistence;
		this.persistenceDriver.initialState = initialState;

		const persistantState = this.persistenceDriver.read().data;

		if (persistantState) {
			currentState = persistantState;
		}

		if (currentState === null) {
			currentState = initialState;
		}

		this.eventManager = new StoreEventManager();
		this.initialState = new Freezer({ state: initialState });
		this.frozenState = new Freezer({ state: currentState }, this.opts);
		this.frozenState.on('update', (currentState, prevState) => {
			this.update(currentState.state, prevState.state);
			this.persistenceDriver.write(this.persistenceDriver.pack(currentState.state));
		});
	}

	get state(): StoreState {
		return this.frozenState.get().state;
	}

	private generateStoreName(state: StoreState): string {
		let flatKeys: string = '';

		for (let key in state) {
			flatKeys += key;
		}
		
		return objectHash(flatKeys);
	}

	public resetPersistence(): void {
		this.persistenceDriver.reset();
	}

	public resetDumpHistory(): void {
		this.persistenceDriver.resetHistory();
		this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
	}

	public saveDump(): void {
		this.persistenceDriver.saveDump(this.persistenceDriver.pack(this.frozenState.get().state));
		this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
	}

	public removeDump(timestamp: number): void {
		this.persistenceDriver.removeDump(timestamp);
		this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
	}

	public restoreDump(timestamp: number): void {
		const pack: StorePersistantPacket<StoreState> = this.persistenceDriver.readDump(timestamp);

		if (pack) {
			this.setState(pack.data);
			this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
		}
	}

	public getDumpHistory(): number[] {
		return this.persistenceDriver.getDumpHistory();
	}

	public setState(newState: Partial<StoreState>): void {
		const newFrozenState = new Freezer(newState);

		for (const prop in newState) {
			const newFrozenProp = newFrozenState.get()[prop];

			if (newFrozenProp !== this.frozenState.get().state[prop]) {
				this.frozenState.get().state.set(prop, newFrozenProp);
			}
		}
	}

	public resetState(): void {
		this.setState(this.initialState.get().state);
	}

	public update(currentState: StoreState, prevState: StoreState): void {
		this.components.forEach((component) => {
			if (component.isStoreMounted) {
				component.storeComponentStoreWillUpdate();
				component.forceUpdate();
				component.storeComponentStoreDidUpdate();
			}
		});

		this.eventManager.fire('update', currentState, prevState);
	}

	public getInitialState(): StoreState {
		return this.initialState.get().state;
	}

	public on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void): StoreEvent<StoreState> {
		const eventTypes: StoreEventType[] = eventType && eventType.constructor === Array ? eventType as StoreEventType[] : [eventType] as StoreEventType[];
		const event: StoreEvent<StoreState> = this.eventManager.add(eventTypes, callback);

		this.eventManager.fire('init', this.frozenState.get().state, this.frozenState.get().state);
		this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);

		return event;
	}
}

export type StoreEventType =
	'all' |
	'init' |
	'update' |
	'dumpUpdate';

export class StoreEvent<StoreState> {
	constructor(
		readonly id: string,
		readonly types: StoreEventType[],
		readonly onFire: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void,
		readonly onRemove: (id: string) => void,
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

	public fire(type: StoreEventType, storeState: StoreState, prevState: StoreState): void {
		this.events.forEach((event: StoreEvent<StoreState>) => {
			if (event.types.indexOf(type) >= 0 || event.types.indexOf('all') >= 0) {
				event.onFire(storeState, prevState, type);
			}
		});
	}

	public remove(id: string): void {
		this.events = this.events.filter((event: StoreEvent<StoreState>) => {
			return event.id !== id;
		});
	}

	public add(eventTypes: StoreEventType[], callback: (storeState: StoreState, prevState?: StoreState, type?: StoreEventType) => void): StoreEvent<StoreState> {
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

export const followStore = <StoreState>(store: Store<StoreState>, followStates?: string[]) => (WrappedComponent: React.ComponentClass): any => {
	class Component extends React.Component {
		private storeEvent: StoreEvent<StoreState> = null;

		state = {
			storeState: null,
		};

		componentWillMount() {
			this.storeEvent = store.on('all', (storeState: StoreState, prevState: StoreState, type?: StoreEventType) => {
				this.forceUpdate();
			});
		}

		componentWillUnmount() {
			this.storeEvent.remove();
		}

		public render() {
			return React.createElement(WrappedComponent, this.props as any);
		}
	}

	return Component;
};
