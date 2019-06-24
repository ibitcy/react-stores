import { Store, StoreEventType } from './store';
export interface IUseStoreOptions<StoreState, MappedState> {
    eventType?: StoreEventType | StoreEventType[];
    mapState?: (storeState: StoreState) => MappedState;
    deps?: any[];
}
export declare function useStore<StoreState = {}, MappedState = StoreState>(store: Store<StoreState>, options?: IUseStoreOptions<StoreState, MappedState>): MappedState;
