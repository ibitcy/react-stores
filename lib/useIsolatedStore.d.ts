import { Store, StoreOptions } from './Store';
import { StorePersistentDriver } from './StorePersistentDriver';
interface StoreOptionsPersist extends StoreOptions {
    persistence: true;
    uniqKey: string;
}
interface StoreOptionsNoPersist extends StoreOptions {
    persistence: false;
}
declare type TStoreOptions = StoreOptionsPersist | StoreOptionsNoPersist;
export declare function useIsolatedStore<T = {}>(initialState: T, storeOptions?: TStoreOptions, persistenceDriver?: StorePersistentDriver<T>): Store<T>;
export {};
