// MyStoreComponent.tsx
import * as React from 'react';
import {Store, StoreComponent} from '../src/store';
import {myStore, IMyStoreState} from './myStore';

interface IStoresState {
  myStore: Store<IMyStoreState>;
}

export class MyStoreComponent extends StoreComponent<any, any, IStoresState> {
  constructor(props: any) {
    super(props, {
      myStore,
    });
  }

  private increase = () => {
    this.stores.myStore.setState({
      counter: this.stores.myStore.state.counter + 1,
    });
  };

  render() {
    return (
      <>
        <p>Counter: {this.stores.myStore.state.counter.toString()}</p>
        <button onClick={this.increase}>Increase counter</button>
      </>
    );
  }
}
