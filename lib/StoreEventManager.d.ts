import { StoreEvent, StoreEventSpecificKeys, StoreEventType, TOnFire, TOnFirePartial, TStoreEvent } from './StoreEvent';
export declare class StoreEventManager<StoreState> {
    readonly fireTimeout: number;
    private events;
    private eventCounter;
    private timeout;
    constructor(fireTimeout: number);
    private generateEventId;
    fire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event?: TStoreEvent<StoreState>): void;
    remove(id: string): void;
    add(eventTypes: StoreEventType[], callback: TOnFire<StoreState>): StoreEvent<StoreState>;
    add(eventTypes: StoreEventType[], callback: TOnFirePartial<StoreState>, includeKeys: Array<keyof StoreState>): StoreEventSpecificKeys<StoreState>;
    private doFire;
}
