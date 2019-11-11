import React from 'react';
import { useStore } from '../lib';
import { myStore, IMyStoreState } from './myStore';

interface IMappedState {
  counter: string;
}

interface IProps {
  index: number;
}

function recursiveFibonacci(num: number) {
  if (num <= 1) {
    return 1;
  }
  return recursiveFibonacci(num - 1) + recursiveFibonacci(num - 2);
}

export const MyHookComponent: React.FunctionComponent<IProps> = ({ index }) => {
  // Memoize you mapState function
  const mapState = React.useCallback(
    (state: IMyStoreState): IMappedState => ({
      counter: recursiveFibonacci(state.counter), // Very long operation
    }),
    [index],
  );

  // Get your state form store
  const { counter } = useStore<IMyStoreState, IMappedState>(myStore, {
    mapState,
  });

  return <p>Counter: {counter}</p>;
};
