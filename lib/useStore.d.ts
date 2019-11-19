import { Store } from './Store';
import { StoreEventType } from './StoreEvent';
export interface IOptions<TS, TMs> {
    eventType?: StoreEventType | StoreEventType[];
    mapState?: (storeState: TS) => TMs;
    compareFunction?: (prevState: TMs, nextState: TMs) => boolean;
    includeKeys?: Array<keyof TS>;
}
/** Connect full store with StoreEventType.All, without performance */
export declare function useStore<TS = {}>(store: Store<TS>): TS;
/**
 * Connect to store with custom StoreEventType and with includeKeys.
 * Event fires when one of depend keys was changed
 * */
export declare function useStore<TS = {}>(store: Store<TS>, includeKeys?: Array<keyof TS>, eventType?: StoreEventType | StoreEventType[]): TS;
export declare function useStore<TS = {}>(store: Store<TS>, includeKeys: Array<keyof TS>): TS;
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
