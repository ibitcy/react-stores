import * as React from 'react';

import {followStore} from '../../src/store';
import {store} from './store';

interface Props {}

interface State {}

@followStore(store)
export class CounterDecorator extends React.Component<Props, State> {
  public render() {
    return (
      <div className="component">
        <h2>Component with store decorator</h2>

        <p>
          Shared state counter: <strong>{store.state.counter.toString()}</strong>
        </p>

        <p>
          Foo state is: <strong>{store.state.foo}</strong>
        </p>

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
