import { areSimilar } from './compare';
import { omit } from './omit';
import { StoreEvent, StoreEventSpecificKeys, StoreEventType, TOnFire, TOnFirePartial, TStoreEvent } from './StoreEvent';

export class StoreEventManager<StoreState> {
  private events: Array<TStoreEvent<StoreState>> = [];
  private eventCounter: number = 0;
  private timeout: any = null;

  constructor(readonly fireTimeout: number) {}

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
          for (const key in this.events) {
            this.doFire(type, storeState, prevState, this.events[key]);
          }
        }, this.fireTimeout);
      } else {
        for (const key in this.events) {
          this.doFire(type, storeState, prevState, this.events[key]);
        }
      }
    }
  }

  public remove(id: string) {
    if (this.fireTimeout && this.fireTimeout !== 0) {
      for (const key in this.events) {
        if (this.events[key].timeout) {
          clearTimeout(this.timeout);
        }
      }
    }

    this.events = this.events.filter((event: TStoreEvent<StoreState>) => {
      return event.id !== id;
    });
  }

  // add overloads
  public add(eventTypes: StoreEventType[], callback: TOnFire<StoreState>): StoreEvent<StoreState>;
  public add(
    eventTypes: StoreEventType[],
    callback: TOnFirePartial<StoreState>,
    includeKeys: Array<keyof StoreState>,
  ): StoreEventSpecificKeys<StoreState>;
  public add(
    eventTypes: StoreEventType[],
    callback: TOnFire<StoreState> | TOnFirePartial<StoreState>,
    includeKeys?: Array<keyof StoreState>,
  ): TStoreEvent<StoreState> {
    let event: TStoreEvent<StoreState>;

    if (includeKeys) {
      event = new StoreEventSpecificKeys<StoreState>(
        this.generateEventId(),
        eventTypes,
        callback as TOnFirePartial<StoreState>,
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

    this.events.push(event);

    return event;
  }

  private doFire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event: TStoreEvent<StoreState>) {
    if (event.types.indexOf(type) >= 0 || event.types.indexOf(StoreEventType.All) >= 0) {
      if (event instanceof StoreEventSpecificKeys) {
        const excludedKeys = Object.keys(storeState).filter(
          key => !event.includeKeys.includes(key as keyof StoreState),
        );
        if (!areSimilar(storeState, prevState, ...excludedKeys)) {
          const omitedStoreState = omit(storeState, ...event.includeKeys);
          const omitedPrevStoreState = omit(prevState, ...event.includeKeys);
          event.onFire(omitedStoreState, omitedPrevStoreState, event.includeKeys, type);
        }
        return;
      }

      event.onFire(storeState, prevState, type);
    }
  }
}
