import React from 'react';
import { followStore } from '../../src';
import { stores } from './stores';

interface Props {}

interface State {
  counter: number;
}

@followStore(stores)
export class Complex extends React.Component<Props, State> {
  state: State = {
    counter: 0,
  };

  private plusOne(): void {
    this.setState({
      counter: this.state.counter + 1,
    });
  }

  public render() {
    return (
      <div className='component'>
        <h2>Test component</h2>

        <p>
          Local state counter: <strong>{this.state.counter.toString()}</strong>
        </p>
        <p>
          Shared state counter: <strong>{stores.state.counter.toString()}</strong>
        </p>
        <p>
          Foo state is: <strong>{stores.state.foo}</strong>
        </p>

        <button onClick={this.plusOne.bind(this)}>Local +1</button>

        <button
          onClick={() => {
            stores.setState({
              counter: stores.state.counter + 1,
            });
          }}>
          Store +1
        </button>

        <button
          onClick={() => {
            stores.setState({
              foo: stores.state.foo === 'foo' ? 'bar' : 'foo',
            });
          }}>
          Store foobar toggle
        </button>
      </div>
    );
  }
}
