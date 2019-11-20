import { Store, StoreOptions } from './Store';
import React from 'react';
import { StorePersistentDriver } from './StorePersistentDriver';
import { StoreEventType } from './StoreEvent';

interface StoreOptionsPersist extends StoreOptions {
  persistence: true;
  uniqKey: string;
}

interface StoreOptionsNoPersist extends StoreOptions {
  persistence: false;
}

type TStoreOptions = StoreOptionsPersist | StoreOptionsNoPersist;

export function useIsolatedStore<T = {}>(
  initialState: T,
  storeOptions?: TStoreOptions,
  persistenceDriver?: StorePersistentDriver<T>,
): Store<T> {
  const recount = React.useState(0);
  const storeRef = React.useRef(
    (() => {
      const initial = { ...initialState };
      if (storeOptions?.persistence) {
        initial[`__persistense_${storeOptions.uniqKey}`] = null;
      }
      return new Store<T>(
        initial,
        {
          persistence: false,
          immutable: true,
          ...storeOptions,
        },
        persistenceDriver,
      );
    })(),
  );

  React.useEffect(() => {
    const event = storeRef.current.on(StoreEventType.Update, () => {
      recount[1](Date.now());
    });

    return () => {
      event.remove();
      if (!storeOptions?.persistence) {
        storeRef.current.resetState();
      }
    };
  }, []);

  return storeRef.current;
}
