// MyFollowStoreComponent.tsx
import React from 'react';
import { followStore } from '../lib';
import { myStore } from './myStore';

// You can use multiple follows
// @followStore(myStore)
// @followStore(myOtherStore)
@followStore(myStore)
export class MyFollowStoreComponent extends React.Component {
  public render() {
    return <p>Counter: {myStore.state.counter.toString()}</p>;
  }
}
