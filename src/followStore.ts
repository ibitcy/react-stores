import * as React from 'react';
import {StoreEventType, StoreEvent} from './StoreEvent';
import {Store} from './Store111';

export const followStore = <StoreState>(store: Store<StoreState>) => (
  WrappedComponent: React.ComponentClass<any, any>,
): any => {
  class Component extends React.Component {
    private storeEvent: StoreEvent<StoreState> = null;

    state = {
      storeState: null,
    };

    componentWillMount() {
      this.storeEvent = store.on(StoreEventType.All, () => {
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      this.storeEvent.remove();
    }

    public render() {
      return React.createElement(WrappedComponent, this.props as any);
    }
  }

  return Component;
};
