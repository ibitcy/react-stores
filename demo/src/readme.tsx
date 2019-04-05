import * as React from 'react';
import {Store, StoreComponent, StoreEvent, StoreEventType, followStore, useStore} from '../../src/store';
import {myStore, IMyStoreState} from '../../examples/myStore';

interface IMappedState {
  counter: string;
}

interface IProps {
  index: number;
}

export const MyHookComponent: React.FunctionComponent<IProps> = ({index}) => {
  // Memoize you mapState function
  const mapState = React.useCallback(
    (state: IMyStoreState): IMappedState => ({
      counter: state.counter.toString(),
    }),
    [index],
  );

  // Get your state form store
  const {counter} = useStore<IMappedState, IMyStoreState>(
    {
      store: myStore,
    },
    mapState,
  );

  return <></>;
};
