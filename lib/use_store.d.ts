import { Store, StoreEventType } from "./store";
export interface IUseStoreOptions<StoreState, MappedState> {
    eventType?: StoreEventType | StoreEventType[];
    mapper?: (storeState: StoreState) => MappedState;
}
export declare function useStore<StoreState = {}, MappedState = StoreState>(store: Store<StoreState>, options?: IUseStoreOptions<StoreState, MappedState>): StoreState | MappedState;
