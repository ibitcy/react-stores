import * as React from 'react';

import { Store } from './Store';
import { StoreEventType, TStoreEvent } from './StoreEvent';

type TMapState<T, V> = (storeState: T, prevState?: T, type?: StoreEventType) => V;
type TCompareFunction<V> = (prevState: V, nextState: V) => boolean;

export interface IOptions<T, V> {
  eventType?: StoreEventType | StoreEventType[];
  mapState?: TMapState<T, V>;
  compare?: TCompareFunction<V>;
}

export interface IOptionsExtended<T, V> extends IOptions<T, V> {
  includeKeys?: Array<keyof T>;
}

function getOption<T, V>(rest: Array<any>): Required<IOptionsExtended<T, V>> {
  const mapState = (store: T) => store as V & T;
  const compare = (a: V, b: V) => a === b;
  const eventType = StoreEventType.All;
  const includeKeys = [];
  if (
    rest[0] &&
    (Object.keys(StoreEventType).includes(rest[0].toString()) ||
      (Array.isArray(rest[0]) && Object.keys(StoreEventType).includes(rest[0][0].toString())))
  ) {
    return {
      eventType: rest[0],
      mapState: rest[1] || mapState,
      compare: rest[2] || compare,
      includeKeys,
    };
  } else if (rest[0] && Array.isArray(rest[0]) && typeof rest[0][0] === 'string') {
    return {
      eventType: rest[1] || eventType,
      mapState,
      compare,
      includeKeys: rest[0],
    };
  } else if (typeof rest[0] === 'function') {
    return {
      eventType,
      mapState: rest[0] || mapState,
      compare: rest[1] || compare,
      includeKeys,
    };
  } else if (rest[0]) {
    return {
      eventType: rest[0].eventType || eventType,
      mapState: rest[0].mapState || mapState,
      compare: rest[0].compare || compare,
      includeKeys,
    };
  }

  return {
    mapState,
    compare,
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
  includeKeys: Array<keyof T>,
  eventType?: StoreEventType | StoreEventType[],
): T;
/**
 * Connect to store with StoreEventTypes.All with mapState function.
 * To incraese performance and to prevent recalucaltaions you can use a compare.
 * Don't use a deep equality in compare when you map an objects or an arrays. It may decrease performance.
 */
export function useStore<T = {}, V = T>(store: Store<T>, mapState: TMapState<T, V>, compare?: TCompareFunction<V>): V;
/** Connect to store with custom StoreEventType */
export function useStore<T = {}, V = T>(
  store: Store<T>,
  eventType: StoreEventType | StoreEventType[],
  mapState?: TMapState<T, V>,
  compare?: TCompareFunction<V>,
): V;
/** Connect to store with old-fashioned API
 */
export function useStore<T = {}, V = T>(store: Store<T>, options: IOptions<T, V>): V;
/** Connect to store without performance
 */
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
      storeEvent = store.on(params.eventType, (storeState, prevState, type) => {
        const nextState = params.mapState(storeState, prevState, type);
        if (!params.compare || !params.compare(nextState, state.current)) {
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
