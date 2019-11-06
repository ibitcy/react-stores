import React, { useEffect, useState } from 'react';
import { stores } from './stores';
import { useStore } from '../../src';

export const Counter: React.FC = () => {
  const storeState = useStore(stores);
  const [storeUpdatesCounter, setStoreUpdatesCounter] = useState(0);

  useEffect(() => {
    setStoreUpdatesCounter(storeUpdatesCounter + 1);
  }, [storeState.counter]);

  return (
    <div className='component'>
      <h2>Linked component</h2>
      <p>
        Shared state counter: <strong>{storeState.counter.toString()}</strong>
      </p>
      <p>
        Foo state is: <strong>{storeState.foo}</strong>
      </p>
      <p>
        Store updates Counter component times: <strong>{storeUpdatesCounter}</strong>
      </p>
      <p />
      <button
        onClick={() => {
          stores.setState({
            counter: storeState.counter + 1,
          });
        }}>
        Store +1
      </button>
    </div>
  );
};
