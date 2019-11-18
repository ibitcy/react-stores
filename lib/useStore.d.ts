import { Store } from './Store';
import { StoreEventType } from './StoreEvent';
export interface IOptions<TS, TMs> {
    eventType?: StoreEventType | StoreEventType[];
    mapState?: (storeState: TS) => TMs;
    compareFunction?: (prevState: TMs, nextState: TMs) => boolean;
}
/** Connect full store with all eventTypes without performance */
export declare function useStore<TS = {}, TMs = TS>(store: Store<TS>): TMs;
/** Connect to store with custom StoreEventType */
export declare function useStore<TS = {}, TMs = TS>(store: Store<TS>, eventType: StoreEventType | StoreEventType[], mapState?: (storeState: TS) => TMs, compareFunction?: (prevState: TMs, nextState: TMs) => boolean): TMs;
/**
 * Connect to store with StoreEventTypes.All using a mapState function.
 * To incraese perforamncne and to prevent recalucaltaions you can use a compareFunction.
 * Don't use a deep equality in compareFunction when you map an objects or an arrays. It may decrease performance.
 */
export declare function useStore<TS = {}, TMs = TS>(store: Store<TS>, mapState: (storeState: TS) => TMs, compareFunction?: (prevState: TMs, nextState: TMs) => boolean): TMs;
/** Connect to store with old-fashioned API
 */
export declare function useStore<TS = {}, TMs = TS>(store: Store<TS>, options: IOptions<TS, TMs>): TMs;
