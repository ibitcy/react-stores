import { Store } from './Store';
import { StoreEventType } from './StoreEvent';
export interface IUseStoreOptions<StoreState, MappedState> {
    eventType?: StoreEventType | StoreEventType[];
    mapState?: (storeState: StoreState) => MappedState;
    deps?: any[];
}
export declare function useStore<StoreState = {}, MappedState = StoreState>(store: Store<StoreState>, options?: IUseStoreOptions<StoreState, MappedState>): MappedState;
