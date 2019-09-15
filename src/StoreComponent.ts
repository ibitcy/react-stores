import * as React from 'react';

/**
 * @deprecated since 2.x
 */
export abstract class StoreComponent<Props, State, StoreState> extends React.Component<Props, State> {
  public stores: Partial<StoreState> = {};
  private isStoreMounted: boolean = false;

  constructor(props: Props, stores: StoreState) {
    super(props);

    this.stores = stores;

    for (let storeObject in this.stores) {
      if (this.stores.hasOwnProperty(storeObject)) {
        let store: any = this.stores[storeObject];
        store.components.push(this);
      }
    }
  }

  public storeComponentDidMount(): void {}

  public storeComponentWillUnmount(): void {}

  public storeComponentWillReceiveProps(nextProps: Props): void {}

  public storeComponentWillUpdate(nextProps: Props, nextState: State): void {}

  public storeComponentDidUpdate(prevProps: Props, prevState: State): void {}

  public shouldStoreComponentUpdate(nextProps: Props, nextState: State): boolean {
    return true;
  }

  public storeComponentStoreWillUpdate(): void {}

  public storeComponentStoreDidUpdate(): void {}

  public componentDidMount(): void {
    this.isStoreMounted = true;
    this.storeComponentDidMount();
  }

  public componentWillUnmount(): void {
    this.storeComponentWillUnmount();

    if (this.stores) {
      for (let storeObject in this.stores) {
        if (this.stores.hasOwnProperty(storeObject)) {
          const store: any = this.stores[storeObject];
          const newComponents = [];

          store.components.forEach(component => {
            if (component !== this) {
              newComponents.push(component);
            }
          });

          store.components = newComponents;
        }
      }
    }

    this.stores = null;
    this.isStoreMounted = false;
  }

  public componentWillReceiveProps(nextProps: Props): void {
    this.storeComponentWillReceiveProps(nextProps);
  }

  public componentWillUpdate(nextProps: Props, nextState: State): void {
    this.storeComponentWillUpdate(nextProps, nextState);
  }

  public componentDidUpdate(prevProps: Props, prevState: State): void {
    this.storeComponentDidUpdate(prevProps, prevState);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.shouldStoreComponentUpdate(nextProps, nextState);
  }
}
