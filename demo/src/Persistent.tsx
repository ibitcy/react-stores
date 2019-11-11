import React from 'react';
import { followStore } from '../../src';
import { persistentStore } from './stores';

interface Props {}

interface State {
  counter: number;
}

@followStore(persistentStore)
export class Persistent extends React.Component<Props, State> {
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
        <h2>Persistent store component</h2>

        <p>
          Local state counter: <strong>{this.state.counter.toString()}</strong>
        </p>
        <p>
          Shared persistent counter: <strong>{persistentStore.state.counter.toString()}</strong>
        </p>
        <p>
          Shared persistent foo: <strong>{persistentStore.state.foo}</strong>
        </p>

        <button onClick={this.plusOne.bind(this)}>Local +1</button>

        <button
          onClick={() => {
            persistentStore.setState({
              counter: persistentStore.state.counter + 1,
            });
          }}>
          Store +1
        </button>

        <button
          onClick={() => {
            persistentStore.setState({
              foo: persistentStore.state.foo === 'foo' ? 'bar' : 'foo',
            });
          }}>
          Store foobar toggle
        </button>
      </div>
    );
  }
}
