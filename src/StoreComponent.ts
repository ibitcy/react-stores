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

  public storeComponentDidMount() {}

  public storeComponentWillUnmount() {}

  public storeComponentWillReceiveProps(nextProps: Props) {}

  public storeComponentWillUpdate(nextProps: Props, nextState: State) {}

  public storeComponentDidUpdate(prevProps: Props, prevState: State) {}

  public shouldStoreComponentUpdate(nextProps: Props, nextState: State): boolean {
    return true;
  }

  public storeComponentStoreWillUpdate() {}

  public storeComponentStoreDidUpdate() {}

  public componentDidMount() {
    this.isStoreMounted = true;
    this.storeComponentDidMount();
  }

  public componentWillUnmount() {
    this.storeComponentWillUnmount();

    if (this.stores) {
      for (let storeObject in this.stores) {
        if (this.stores.hasOwnProperty(storeObject)) {
          const store: any = this.stores[storeObject];
          const newComponents = [];

          for (const component in store.components) {
            if (store.components[component] !== this) {
              newComponents.push(component);
            }
          }

          store.components = newComponents;
        }
      }
    }

    this.stores = null;
    this.isStoreMounted = false;
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.storeComponentWillReceiveProps(nextProps);
  }

  public componentWillUpdate(nextProps: Props, nextState: State) {
    this.storeComponentWillUpdate(nextProps, nextState);
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    this.storeComponentDidUpdate(prevProps, prevState);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.shouldStoreComponentUpdate(nextProps, nextState);
  }
}
