import * as React from 'react';

import { followStore } from '../../lib';
import { stores } from './stores';

interface Props {}

interface State {}

@followStore(stores)
export class CounterDecorator extends React.Component<Props, State> {
  public render() {
    return (
      <div className='component'>
        <h2>Component with store decorator</h2>

        <p>
          Shared state counter: <strong>{stores.state.counter.toString()}</strong>
        </p>

        <p>
          Foo state is: <strong>{stores.state.foo}</strong>
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
  }
}
