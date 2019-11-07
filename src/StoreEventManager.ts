import { StoreEvent, StoreEventType } from './StoreEvent';

export class StoreEventManager<StoreState> {
  private events: StoreEvent<StoreState>[] = [];
  private eventCounter: number = 0;
  private timeout: any = null;

  constructor(readonly fireTimeout: number) {}

  private generateEventId(): string {
    return `${++this.eventCounter}${Date.now()}${Math.random()}`;
  }

  public fire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event?: StoreEvent<StoreState>) {
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
            if (this.events.hasOwnProperty(key)) {
              this.doFire(type, storeState, prevState, this.events[key]);
            }
          }
        }, this.fireTimeout);
      } else {
        for (const key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            this.doFire(type, storeState, prevState, this.events[key]);
          }
        }
      }
    }
  }

  public remove(id: string) {
    if (this.fireTimeout && this.fireTimeout !== 0) {
      for (const key in this.events) {
        if (this.events.hasOwnProperty(key) && this.events[key].timeout) {
          clearTimeout(this.timeout);
        }
      }
    }

    this.events = this.events.filter((event: StoreEvent<StoreState>) => {
      return event.id !== id;
    });
  }

  public add(
    eventTypes: StoreEventType[],
    callback: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void,
  ): StoreEvent<StoreState> {
    const event = new StoreEvent<StoreState>(this.generateEventId(), eventTypes, callback, id => {
      this.remove(id);
    });

    this.events.push(event);

    return event;
  }

  private doFire(type: StoreEventType, storeState: StoreState, prevState: StoreState, event: StoreEvent<StoreState>) {
    if (event.types.indexOf(type) >= 0 || event.types.indexOf(StoreEventType.All) >= 0) {
      event.onFire(storeState, prevState, type);
    }
  }
}
