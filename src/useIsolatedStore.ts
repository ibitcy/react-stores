import { Store, StoreOptions } from './Store';
import React from 'react';
import { StorePersistentDriver } from './StorePersistentDriver';
import { StoreEventType } from './StoreEvent';

export function useIsolatedStore<T = {}>(
  initialState: T,
  storeOptions?: StoreOptions,
  persistenceDriver?: StorePersistentDriver<T>,
): Store<T> {
  const recount = React.useState(0);
  const storeRef = React.useRef(
    new Store<T>(
      initialState,
      {
        persistence: false,
        immutable: true,
        ...storeOptions,
      },
      persistenceDriver,
    ),
  );

  React.useEffect(() => {
    const event = storeRef.current.on(StoreEventType.All, () => {
      recount[1](Date.now());
    });

    return () => {
      event.remove();
      storeRef.current.resetState();
    };
  }, []);

  return storeRef.current;
}
