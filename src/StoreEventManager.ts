import { areSimilar } from './compare';
import {
  StoreEvent,
  StoreEventSpecificKeys,
  StoreEventType,
  TEventId,
  TOnFire,
  TOnFireWithKeys,
  TStoreEvent,
} from './StoreEvent';

export class StoreEventManager<StoreState> {
  private events: Set<TStoreEvent<StoreState>> = new Set();
  private eventCounter: number = 0;
  private timeout: any = null;
  private _hook: any = null;

  constructor(readonly fireTimeout: number, readonly name: string) {
    this._hook = typeof window !== 'undefined' && window['__REACT_STORES_INSPECTOR__'];
  }

  public getEventsCount() {
    return this.events.size;
  }

  private generateEventId(): string {
    return `${++this.eventCounter}${Date.now()}${Math.random()}`;
  }

  public fire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event?: TStoreEvent<StoreState>) {
    if (event) {
      if (this.fireTimeout && this.fireTimeout !== 0) {
        if (event.timeout) {
          clearTimeout(this.timeout);
        }

        event.timeout = setTimeout(() => {
          this.doFire(type, storeState, prevState, event);
        }, this.fireTimeout);
      } else {
        this.doFire(type, storeState, prevState, event);
      }
    } else {
      if (this.fireTimeout && this.fireTimeout !== 0) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
          this.events.forEach((eventItem: StoreEvent<StoreState>) => {
            this.doFire(type, storeState, prevState, eventItem);
          });
        }, this.fireTimeout);
      } else {
        this.events.forEach((eventItem: StoreEvent<StoreState>) => {
          this.doFire(type, storeState, prevState, eventItem);
        });
      }
    }
  }

  public remove(id: TEventId) {
    if (this.fireTimeout && this.fireTimeout !== 0) {
      this.events.forEach((eventItem: StoreEvent<StoreState>) => {
        if (eventItem.timeout) {
          clearTimeout(this.timeout);
        }
      })
    }

    this.events.forEach((eventItem: StoreEvent<StoreState>) => {
      if (eventItem.id === id) {
        this.events.delete(eventItem);
      }
    });

    if (this._hook) {
      this._hook.removeEvent(this.name, id);
    }
  }

  // add overloads
  public add(eventTypes: StoreEventType[], callback: TOnFire<StoreState>): StoreEvent<StoreState>;
  public add(
    eventTypes: StoreEventType[],
    callback: TOnFireWithKeys<StoreState>,
    includeKeys: Array<keyof StoreState>,
  ): StoreEventSpecificKeys<StoreState>;
  public add(
    eventTypes: StoreEventType[],
    callback: TOnFire<StoreState> | TOnFireWithKeys<StoreState>,
    includeKeys?: Array<keyof StoreState>,
  ): TStoreEvent<StoreState> {
    let event: TStoreEvent<StoreState>;

    if (includeKeys) {
      event = new StoreEventSpecificKeys<StoreState>(
        this.generateEventId(),
        eventTypes,
        callback as TOnFireWithKeys<StoreState>,
        id => {
          this.remove(id);
        },
        includeKeys,
      );
    } else {
      event = new StoreEvent<StoreState>(this.generateEventId(), eventTypes, callback as TOnFire<StoreState>, id => {
        this.remove(id);
      });
    }

    this.events.add(event);

    if (this._hook) {
      this._hook.addEvent(this.name, event.id);
    }

    return event;
  }

  private doFire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event: TStoreEvent<StoreState>) {
    if (event.types.includes(type) || event.types.includes(StoreEventType.All)) {
      if (event instanceof StoreEventSpecificKeys) {
        const excludedKeys = Object.keys(storeState).filter(
          key => !event.includeKeys.includes(key as keyof StoreState),
        );
        if (!areSimilar(storeState, prevState, ...excludedKeys)) {
          event.onFire(storeState, prevState, event.includeKeys, type);
        }
        return;
      }

      event.onFire(storeState, prevState, type);
    }
  }
}
