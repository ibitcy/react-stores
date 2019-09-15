export enum StoreEventType {
  All,
  Init,
  Update,
  DumpUpdate,
}

export class StoreEvent<StoreState> {
  public timeout: any = null;

  constructor(
    readonly id: string,
    readonly types: StoreEventType[],
    readonly onFire: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void,
    readonly onRemove: (id: string) => void,
  ) {}

  public remove(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.onRemove(this.id);
  }
}
