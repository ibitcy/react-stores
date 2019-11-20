import React, { FC } from 'react';
import { useIsolatedStore } from '../../lib';

interface IMyStoreState {
  counter: number;
}

const initialState = {
  counter: 0,
};

function getRandomName(count: number): string {
  return `ABC${String.fromCharCode(48 + count)}`;
}

export const IsolatedComponent: FC<{ name: string }> = ({ name }) => {
  const myStore = useIsolatedStore<IMyStoreState>(initialState, {
    uniqKey: name,
    persistence: true,
    immutable: true,
  });

  const handleIncrement = React.useCallback(() => {
    myStore.setState({
      counter: myStore.state.counter + 1,
    });
  }, [myStore.state.counter]);

  const handleDecrement = React.useCallback(() => {
    myStore.setState({
      counter: myStore.state.counter - 1,
    });
  }, [myStore.state.counter]);

  return (
    <div className='component' style={{ margin: 10, padding: 20, flexBasis: 'calc(33.3% - 20px)' }}>
      <p style={{ marginTop: 0 }}>
        <strong>Isolated state hash - {name}</strong>
      </p>
      <p>
        Isolated state: <strong>{myStore.state.counter}</strong>
      </p>
      <div className='row'>
        <button onClick={handleIncrement}>Increment</button>
        <button style={{ marginRight: 0 }} onClick={handleDecrement}>
          Decrement
        </button>
      </div>
    </div>
  );
};

export const IsolatedStores = () => {
  const myStore = useIsolatedStore<IMyStoreState>(initialState, {
    persistence: true,
    immutable: true,
    uniqKey: 'isolatedContainer',
  });

  const handleIncrement = React.useCallback(() => {
    myStore.setState({
      counter: myStore.state.counter + 1,
    });
  }, [myStore.state.counter]);

  const handleDecrement = React.useCallback(() => {
    myStore.setState({
      counter: myStore.state.counter - 1,
    });
  }, [myStore.state.counter]);

  let components = [];

  for (let i = 0; i < myStore.state.counter; i++) {
    components.push(<IsolatedComponent name={getRandomName(i)} />);
  }

  return (
    <React.Fragment>
      <span className='row left-aligned'>
        <button onClick={handleIncrement}>Add isolated component</button>
        <button onClick={handleDecrement}>Remove isolated component</button>
      </span>
      <div
        className='row'
        style={{
          margin: '10px -10px -10px',
        }}>
        {components}
      </div>
    </React.Fragment>
  );
};
