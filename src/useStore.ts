import * as React from 'react';

import { Store } from './Store';
import { StoreEventType, TStoreEvent } from './StoreEvent';

export interface IOptions<T, V> {
  eventType?: StoreEventType | StoreEventType[];
  mapState?: (storeState: T) => V;
  compareFunction?: (prevState: V, nextState: V) => boolean;
  includeKeys?: Array<keyof T>;
}

function getOption<T, V>(rest: Array<any>): Required<IOptions<T, V>> {
  const mapState = (store: T) => store as V & T;
  const compareFunction = null;
  const eventType = StoreEventType.All;
  const includeKeys = [];
  if (
    rest[0] &&
    (Object.keys(StoreEventType).indexOf(rest[0].toString()) >= 0 ||
      (Array.isArray(rest[0]) && Object.keys(StoreEventType).indexOf(rest[0][0].toString()) >= 0))
  ) {
    return {
      eventType: rest[0],
      mapState: rest[1] || mapState,
      compareFunction: rest[2] || compareFunction,
      includeKeys,
    };
  } else if (rest[0] && Array.isArray(rest[0]) && typeof rest[0][0] === 'string') {
    return {
      eventType: rest[1] || eventType,
      mapState,
      compareFunction,
      includeKeys: rest[0],
    };
  } else if (typeof rest[0] === 'function') {
    return {
      eventType,
      mapState: rest[0] || mapState,
      compareFunction: rest[1] || compareFunction,
      includeKeys,
    };
  } else if (rest[0]) {
    return {
      eventType: rest[0].eventType || eventType,
      mapState: rest[0].mapState || mapState,
      compareFunction: rest[0].compareFunction || compareFunction,
      includeKeys,
    };
  }

  return {
    mapState,
    compareFunction,
    eventType,
    includeKeys,
  };
}

/**
 * Connect to store with includeKeys.
 * Event fires when one of depend keys was changed
 * */
export function useStore<T = {}>(store: Store<T>, includeKeys: Array<keyof T>): T;
/**
 * Connect to store with custom StoreEventType and with includeKeys.
 * Event fires when one of depend keys was changed
 * */
export function useStore<T = {}>(
  store: Store<T>,
  includeKeys?: Array<keyof T>,
  eventType?: StoreEventType | StoreEventType[],
): T;
/**
 * Connect to store with StoreEventTypes.All using a mapState function.
 * To incraese perforamncne and to prevent recalucaltaions you can use a compareFunction.
 * Don't use a deep equality in compareFunction when you map an objects or an arrays. It may decrease performance.
 */
export function useStore<T = {}, V = T>(
  store: Store<T>,
  mapState: (storeState: T) => V,
  compareFunction?: (prevState: V, nextState: V) => boolean,
): V;
/** Connect to store with custom StoreEventType */
export function useStore<T = {}, V = T>(
  store: Store<T>,
  eventType: StoreEventType | StoreEventType[],
  mapState?: (storeState: T) => V,
  compareFunction?: (prevState: V, nextState: V) => boolean,
): V;
/** Connect to store with old-fashioned API
 */
export function useStore<T = {}, V = T>(store: Store<T>, options: Omit<IOptions<T, V>, 'includeKeys'>): V;

/** Connect full store with StoreEventType.All, without performance */
export function useStore<T = {}>(store: Store<T>): T;

export function useStore<T = {}, V = T>(store: Store<T>, ...restParams: Array<any>): V {
  const params = React.useMemo(() => {
    return getOption<T, V>(restParams);
  }, []);

  const initialRef = React.useMemo(() => params.mapState(store.state), []);

  const recount = React.useState(0);
  const state = React.useRef<V>(initialRef);

  React.useEffect(() => {
    let storeEvent: TStoreEvent<T>;

    if (params.includeKeys.length > 0) {
      storeEvent = store.on(params.eventType, params.includeKeys, storeState => {
        state.current = params.mapState(storeState);
        recount[1](Date.now());
      });
    } else {
      storeEvent = store.on(params.eventType, storeState => {
        const nextState = params.mapState(storeState);
        if (!params.compareFunction || !params.compareFunction(nextState, state.current)) {
          state.current = nextState;
          recount[1](Date.now());
        }
      });
    }

    return () => {
      storeEvent.remove();
    };
  }, []);

  return state.current;
}
