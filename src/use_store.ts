import * as React from 'react';
import { Store, StoreEventType } from "./store";

export interface IUseStoreOptions<StoreState, MappedState> {
  eventType?: StoreEventType | StoreEventType[];
  mapState?: (storeState: StoreState) => MappedState;
}

export function useStore<StoreState = {}, MappedState = StoreState>(
  store: Store<StoreState>,
  options: IUseStoreOptions<StoreState, MappedState> = {},
): StoreState | MappedState {
  const [state, setState] = React.useState(options.mapState ? options.mapState(store.state) : store.state);

  React.useEffect(() => {
    const storeEvent = store.on(options.eventType || StoreEventType.Update, storeState => {
      setState(options.mapState ? options.mapState(storeState) : storeState);
    });

    return () => {
      storeEvent.remove();
    };
  }, []);

  return state;
}
