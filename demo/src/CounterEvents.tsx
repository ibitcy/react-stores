import * as React from 'react';

import { StoreEvent, StoreEventType } from '../../lib';
import { stores, StoreState } from './stores';

interface Props {}

interface State {
  commonStoreState: StoreState;
}

export class CounterEvents extends React.Component<Props, State> {
  event: StoreEvent<StoreState> = null;

  state: State = {
    commonStoreState: null,
  };

  componentDidMount() {
    this.event = stores.on(StoreEventType.All, (storeState: StoreState) => {
      this.setState({
        commonStoreState: storeState,
      });
    });
  }

  componentWillUnmount() {
    this.event.remove();
  }

  public render() {
    if (this.state.commonStoreState) {
      return (
        <div className='component'>
          <h2>Linked component with event driven states</h2>

          <p>
            Shared state counter: <strong>{this.state.commonStoreState.counter.toString()}</strong>
          </p>

          <p>
            Foo state is: <strong>{this.state.commonStoreState.foo}</strong>
          </p>

          <button
            onClick={() => {
              stores.setState({
                counter: stores.state.counter + 1,
              });
            }}>
            Store +1
          </button>
        </div>
      );
    } else {
      return null;
    }
  }
}
