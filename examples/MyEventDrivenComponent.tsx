// MyEventDrivenComponent.tsx
import React from 'react';
import { StoreEvent, StoreEventType } from '../lib';
import { myStore, IMyStoreState } from './myStore';

interface State {
  myStoreState: IMyStoreState;
}

export class MyEventDrivenComponent extends React.Component<any, State> {
  private storeEvent: StoreEvent<IMyStoreState> = null;

  state: State = {
    myStoreState: myStore.state,
  };

  comonentDidMount() {
    // Add store state event binder
    this.storeEvent = myStore.on(StoreEventType.All, (storeState: IMyStoreState, prevState: IMyStoreState) => {
      this.setState({
        myStoreState: storeState,
      });
    });
  }

  componentDidUnmount() {
    // Remove store state event binder
    this.storeEvent.remove();
  }

  render() {
    return <p>Counter: {this.state.myStoreState.counter.toString()}</p>;
  }
}
