import { Store } from './Store';
import { StoreEventType } from './StoreEvent';
declare type TMapState<T, V> = (storeState: T, prevState?: T, type?: StoreEventType) => V;
declare type TCompareFunction<V> = (prevState: V, nextState: V) => boolean;
export interface IOptions<T, V> {
    eventType?: StoreEventType | StoreEventType[];
    mapState?: TMapState<T, V>;
    compare?: TCompareFunction<V>;
}
export interface IOptionsExtended<T, V> extends IOptions<T, V> {
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
export declare function useStore<T = {}>(store: Store<T>, includeKeys: Array<keyof T>, eventType?: StoreEventType | StoreEventType[]): T;
/**
 * Connect to store with StoreEventTypes.All with mapState function.
 * To incraese performance and to prevent recalucaltaions you can use a compare.
 * Don't use a deep equality in compare when you map an objects or an arrays. It may decrease performance.
 */
export declare function useStore<T = {}, V = T>(store: Store<T>, mapState: TMapState<T, V>, compare?: TCompareFunction<V>): V;
/** Connect to store with custom StoreEventType */
export declare function useStore<T = {}, V = T>(store: Store<T>, eventType: StoreEventType | StoreEventType[], mapState?: TMapState<T, V>, compare?: TCompareFunction<V>): V;
/** Connect to store with old-fashioned API
 */
export declare function useStore<T = {}, V = T>(store: Store<T>, options: IOptions<T, V>): V;
/** Connect to store without performance
 */
export declare function useStore<T = {}>(store: Store<T>): T;
export {};
