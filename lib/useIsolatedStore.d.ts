import { Store, StoreOptions } from './Store';
import { StorePersistentDriver } from './StorePersistentDriver';
export declare function useIsolatedStore<T = {}>(initialState: T, storeOptions?: StoreOptions, persistenceDriver?: StorePersistentDriver<T>): Store<T>;
