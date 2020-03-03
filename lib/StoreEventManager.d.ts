import { StoreEvent, StoreEventSpecificKeys, StoreEventType, TOnFire, TOnFireWithKeys, TStoreEvent } from './StoreEvent';
export declare class StoreEventManager<StoreState> {
    readonly fireTimeout: number;
    readonly name: string;
    private events;
    private eventCounter;
    private timeout;
    private _hook;
    constructor(fireTimeout: number, name: string);
    getEventsCount(): number;
    private generateEventId;
    fire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event?: TStoreEvent<StoreState>): void;
    remove(id: string): void;
    add(eventTypes: StoreEventType[], callback: TOnFire<StoreState>): StoreEvent<StoreState>;
    add(eventTypes: StoreEventType[], callback: TOnFireWithKeys<StoreState>, includeKeys: Array<keyof StoreState>): StoreEventSpecificKeys<StoreState>;
    private doFire;
}
