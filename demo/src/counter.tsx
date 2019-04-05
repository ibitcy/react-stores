import * as React from 'react';

import {Store, StoreComponent} from '../../src/store';
import {store, StoreState} from './store';

interface Props {
  items: {value: number}[];
}

interface State {
  storeComponentWillReceivePropsFiredTimes: number;
}

interface StoresState {
  common: Store<StoreState>;
}

export class Counter extends StoreComponent<Props, State, StoresState> {
  state = {
    storeComponentWillReceivePropsFiredTimes: 0,
  };

  constructor(props: Props) {
    super(props, {
      common: store,
    });
  }

  storeComponentWillReceiveProps() {
    this.setState({
      storeComponentWillReceivePropsFiredTimes: this.state.storeComponentWillReceivePropsFiredTimes + 1,
    });
  }

  public render() {
    return (
      <div className="component">
        <h2>Linked comonent</h2>
        <p>
          Shared state counter: <strong>{this.stores.common.state.counter.toString()}</strong>
        </p>
        <p>
          Foo state is: <strong>{this.stores.common.state.foo}</strong>
        </p>
        <p>
          storeComponentWillReceiveProps : <strong>{this.state.storeComponentWillReceivePropsFiredTimes}</strong>
        </p>
        <p />
        <button
          onClick={() => {
            store.setState({
              counter: store.state.counter + 1,
            });
          }}
        >
          Store +1
        </button>
      </div>
    );
  }
}
