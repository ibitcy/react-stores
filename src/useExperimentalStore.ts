import * as React from 'react';

import { Store } from './Store';
import { StoreEventType } from './StoreEvent';
import { areSimilar } from './compare';

interface IOptions<StoreState, MappedState> {
  mapState?: (store: StoreState) => MappedState;
  mapStateDeps?: [];
  equal?: (prevState: MappedState, nextState: MappedState) => boolean;
  eventType?: StoreEventType;
}

export function useExperimentalStore<StoreState, MappedState>(
  store: Store<StoreState>,
  {
    mapState = store => store as MappedState & StoreState,
    equal = areSimilar,
    mapStateDeps = [],
    eventType = StoreEventType.Update,
  }: IOptions<StoreState, MappedState>,
): MappedState {
  const mapStateMemoised = React.useCallback(
    (stateStore: StoreState): MappedState => mapState(stateStore) as MappedState,
    mapStateDeps,
  );
  const recount = React.useState(0);

  React.useEffect(() => {
    const storeEvent = store.on(eventType, (storeState, prevState) => {
      const nextState = mapStateMemoised(storeState);
      if (!equal(nextState, mapStateMemoised(prevState))) {
        recount[1](Date.now());
      }
    });

    return () => {
      storeEvent.remove();
    };
  }, []);

  return mapStateMemoised(store.state);
}

// function simpleEqual<StoreState>(a: StoreState, b: StoreState) {
//   // Equal arrays length
//   if (Array.isArray(a) && Array.isArray(b)) {
//     if (a.length !== b.length) {
//       return false;
//     }
//   } else if (typeof a === 'object' && typeof b === 'object') {
//     const keysA = Object.keys(a);
//     const keysB = Object.keys(b);

//     if (keysA.length !== keysB.length) {
//       return false;
//     }

//     for (let i = keysA.length; i-- !== 0; ) {
//       if (!simpleEqual(b[keysB[i]], a[keysA[i]])) {
//         return false;
//       }
//     }

//     return true;
//   }

//   // Equal simple types strings, bool, number
//   return a === b;
// }
