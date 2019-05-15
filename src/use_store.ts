import * as React from 'react';

import { Store, StoreEventType } from './store';

export interface IUseStoreOptions<StoreState, MappedState> {
  eventType?: StoreEventType | StoreEventType[];
  mapState?: (storeState: StoreState) => MappedState;
}

export function useStore<StoreState = {}, MappedState = StoreState>(
  store: Store<StoreState>,
  options: IUseStoreOptions<StoreState, MappedState> = {},
): MappedState {
  const deps = options.deps || []; 
  const mapState = React.useCallback(
    (stateStore: StoreState): MappedState => (options.mapState ? options.mapState(stateStore) : (stateStore as any)),
    deps,
  );
  const [state, setState] = React.useState(mapState(store.state));

  React.useEffect(() => {
    const storeEvent = store.on(options.eventType || StoreEventType.All, storeState => {
      setState(mapState(storeState));
    });

    return () => {
      storeEvent.remove();
    };
  }, []);

  return state;
}
