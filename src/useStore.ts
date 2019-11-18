import * as React from 'react';

import { Store } from './Store';
import { StoreEventType } from './StoreEvent';

export interface IOptions<TS, TMs> {
  eventType?: StoreEventType | StoreEventType[];
  mapState?: (storeState: TS) => TMs;
  compareFunction?: (prevState: TMs, nextState: TMs) => boolean;
}

function getOption<TS, TMs>(rest: Array<any>): Required<IOptions<TS, TMs>> {
  const mapState = (store: TS) => store as TMs & TS;
  const compareFunction = null;
  const eventType = StoreEventType.All;

  if (
    rest[0] &&
    (Object.keys(StoreEventType).indexOf(rest[0].toString()) >= 0 ||
      (Array.isArray(rest)[0] && Object.keys(StoreEventType).indexOf(rest[0][0].toString()) >= 0))
  ) {
    return {
      eventType: rest[0],
      mapState: rest[1] || mapState,
      compareFunction: rest[2] || compareFunction,
    };
  } else if (typeof rest[0] === 'function') {
    return {
      eventType,
      mapState: rest[0] || mapState,
      compareFunction: rest[1] || compareFunction,
    };
  } else if (rest[0]) {
    return {
      eventType: rest[0].eventType || eventType,
      mapState: rest[0].mapState || mapState,
      compareFunction: rest[0].compareFunction || compareFunction,
    };
  }

  return {
    mapState,
    compareFunction,
    eventType,
  };
}

/** Connect full store with all eventTypes without performance */
export function useStore<TS = {}, TMs = TS>(store: Store<TS>): TMs;
/** Connect to store with custom StoreEventType */
export function useStore<TS = {}, TMs = TS>(
  store: Store<TS>,
  eventType: StoreEventType | StoreEventType[],
  mapState?: (storeState: TS) => TMs,
  compareFunction?: (prevState: TMs, nextState: TMs) => boolean,
): TMs;
/**
 * Connect to store with StoreEventTypes.All using a mapState function.
 * To incraese perforamncne and to prevent recalucaltaions you can use a compareFunction.
 * Don't use a deep equality in compareFunction when you map an objects or an arrays. It may decrease performance.
 */
export function useStore<TS = {}, TMs = TS>(
  store: Store<TS>,
  mapState: (storeState: TS) => TMs,
  compareFunction?: (prevState: TMs, nextState: TMs) => boolean,
): TMs;
/** Connect to store with old-fashioned API
 */
export function useStore<TS = {}, TMs = TS>(store: Store<TS>, options: IOptions<TS, TMs>): TMs;

export function useStore<TS = {}, TMs = TS>(store: Store<TS>, ...restParams: Array<any>): TMs {
  const params = React.useMemo(() => {
    return getOption<TS, TMs>(restParams);
  }, []);

  const initialRef = React.useMemo(() => params.mapState(store.state), []);

  const recount = React.useState(0);
  const state = React.useRef<TMs>(initialRef);

  React.useEffect(() => {
    const storeEvent = store.on(params.eventType, storeState => {
      const nextState = params.mapState(storeState);
      if (!params.compareFunction || !params.compareFunction(nextState, state.current)) {
        recount[1](Date.now());
        state.current = nextState;
      }
    });

    return () => {
      storeEvent.remove();
    };
  }, []);

  return state.current;
}
