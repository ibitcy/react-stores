import { Store } from './Store';
import { StoreEventType } from './StoreEvent';
interface IOptions<StoreState, MappedState> {
    mapState?: (store: StoreState) => MappedState;
    mapStateDeps?: [];
    equal?: (prevState: MappedState, nextState: MappedState) => boolean;
    eventType?: StoreEventType;
}
export declare function useExperimentalStore<StoreState, MappedState>(store: Store<StoreState>, { mapState, equal, mapStateDeps, eventType, }: IOptions<StoreState, MappedState>): MappedState;
export {};
