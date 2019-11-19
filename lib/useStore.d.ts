import { Store } from './Store';
import { StoreEventType } from './StoreEvent';
export interface IOptions<T, V> {
    eventType?: StoreEventType | StoreEventType[];
    mapState?: (storeState: T) => V;
    compareFunction?: (prevState: V, nextState: V) => boolean;
    includeKeys?: Array<keyof T>;
}
/**
 * Connect to store with includeKeys.
 * Event fires when one of depend keys was changed
 * */
export declare function useStore<T = {}>(store: Store<T>, includeKeys: Array<keyof T>): T;
/**
 * Connect to store with custom StoreEventType and with includeKeys.
 * Event fires when one of depend keys was changed
 * */
export declare function useStore<T = {}>(store: Store<T>, includeKeys?: Array<keyof T>, eventType?: StoreEventType | StoreEventType[]): T;
/**
 * Connect to store with StoreEventTypes.All using a mapState function.
 * To incraese perforamncne and to prevent recalucaltaions you can use a compareFunction.
 * Don't use a deep equality in compareFunction when you map an objects or an arrays. It may decrease performance.
 */
export declare function useStore<T = {}, V = T>(store: Store<T>, mapState: (storeState: T) => V, compareFunction?: (prevState: V, nextState: V) => boolean): V;
/** Connect to store with custom StoreEventType */
export declare function useStore<T = {}, V = T>(store: Store<T>, eventType: StoreEventType | StoreEventType[], mapState?: (storeState: T) => V, compareFunction?: (prevState: V, nextState: V) => boolean): V;
/** Connect to store with old-fashioned API
 */
export declare function useStore<T = {}, V = T>(store: Store<T>, options: Omit<IOptions<T, V>, 'includeKeys'>): V;
/** Connect full store with StoreEventType.All, without performance */
export declare function useStore<T = {}>(store: Store<T>): T;
