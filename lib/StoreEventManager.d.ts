import { StoreEvent, StoreEventType } from './StoreEvent';
export declare class StoreEventManager<StoreState> {
    readonly fireTimeout: number;
    private events;
    private eventCounter;
    private timeout;
    constructor(fireTimeout: number);
    private generateEventId;
    fire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event?: StoreEvent<StoreState>): void;
    remove(id: string): void;
    add(eventTypes: StoreEventType[], callback: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void): StoreEvent<StoreState>;
    private doFire;
}
