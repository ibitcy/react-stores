# react-stores

![react-stores](https://ibitcy.github.io/react-stores/react-stores.svg)

[![Build Status](https://travis-ci.org/ibitcy/react-stores.svg?branch=master)](https://travis-ci.org/ibitcy/react-stores)
[![npm version](https://badge.fury.io/js/react-stores.svg)](https://badge.fury.io/js/react-stores)

Shared states for React.

## How to install

```shell
npm i react-stores --save
```

## Demo

[Online demo](https://ibitcy.github.io/react-stores/)

For local demo clone this repo and run the script below inside the dir, then go to http://localhost:9000 in your browser

```bash
npm i && npm run demo
```

## Tests

```bash
npm run test
```

## How to use

### Create a Store

```typescript
// myStore.ts
import {Store} from 'react-stores';

export interface IMyStoreState {
  counter: number;
}

export const myStore = new Store<IMyStoreState>({
  counter: 0, // initial state values
});
```

### Event-driven component

```typescript jsx
// EventDrivenComponent.tsx
import * as React from 'react';
import {StoreEvent, StoreEventType} from 'react-stores';
import {myStore, IMyStoreState} from './myStore';

interface State {
  myStoreState: IMyStoreState;
}

export class EventDrivenComponent extends React.Component<any, State> {
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
```

### Component with followStore decorator

```typescript jsx
// FollowStoreComponent.tsx
import * as React from 'react';
import {followStore} from 'react-stores';
import {myStore} from './myStore';

// you can use multiple follows
// @followStore(myStore)
// @followStore(myOtherStore)
@followStore(myStore)
export class CounterDecorator extends React.Component {
  public render() {
    return <p>Counter: {myStore.state.counter.toString()}</p>;
  }
}
```

### Component Hooks

```typescript
import * as React from 'react';
import {useStore} from 'react-stores';
import {myStore, IMyStoreState} from './myStore';

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

export const MyHookComponent: React.FunctionComponent<IProps> = (props: IProps) => {
  // Memoize your mapState function
  const mapState = React.useCallback(
    (state: IMyStoreState): IMappedState => ({
      counter: recursiveFibonacci(state.counter), // Very long operation
    }),
    [props.index],
  );

  // Get your state form store
  const {counter} = useStore<IMappedState, IMyStoreState>(
    {
      store: myStore,
    },
    mapState,
  );

  return <p>Counter: {counter}</p>;
};
```

### Mutating store state

```typescript
import {myStore} from './myStore';

myStore.setState({
  counter: 9999,
});
```

### Read store state value

```typescript
import {myStore} from './myStore';

console.log(myStore.state.counter); // 9999
```

## API

### Store

#### Store constructor

| Argument            | Type           | Optional | Description                                        |
| ------------------- | -------------- | -------- | -------------------------------------------------- |
| `initialState`      | `StoreState`   | No       | Initial state values object                        |
| `options`           | `StoreOptions` | Yes      | See `StoreOptions`                                 |
| `persistenceDriver` | `StoreState`   | Yes      | `StorePersistentDriver<StoreState>` class instance |

#### StoreState

It can be any interface describes your store's state.

#### initialState

Any object corresponding to StoreState interface.

#### StoreOptions

| Property          | Type      | Default | Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | --------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `live`            | `boolean` | `false` | Yes      | With live mode on, freezer emits the update events just when the changes happen, instead of batching all the changes and emiting the event on the next tick. This is useful if you want freezer to store input field values.                                                                                                                                                                                                                                                                                                                             |
| `freezeInstances` | `boolean` | `false` | Yes      | It's possible to store class instances in freezer. They are handled like strings or numbers, added to the state like non-frozen leaves. Keep in mind that if their internal state changes, freezer won't emit any update event. If you want freezer to handle them as freezer nodes, set 'freezerInstances: true'. They will be frozen and you will be able to update their attributes using freezer methods, but remember that any instance method that update its internal state may fail (the instance is frozen) and wouldn't emit any update event. |
| `mutable`         | `boolean` | `false` | Yes      | Once you get used to freezer, you can see that immutability is not necessary if you learn that you shouldn't update the data directly. In that case, disable immutability in the case that you need a small performance boost.                                                                                                                                                                                                                                                                                                                           |

#### Store methods

| Method name        | Arguments                                                                                                                                    | Returns                  | Description                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `setState`         | `newState: Partial<StoreState>`                                                                                                              | `void`                   | Set store's state to provided new one can be partial                                       |
| `resetState`       | No                                                                                                                                           | `void`                   | Reset srote to it's `initialState`                                                         |
| `update`           | No                                                                                                                                           | `void`                   | Force update all bound components and emit events                                          |
| `on`               | `eventType: StoreEventType | StoreEventType[]`<br/>`callback: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void` | `StoreEvent<StoreState>` | Subscribe to store state event listener                                                    |
| `resetPersistence` | No                                                                                                                                           | `void`                   | Reset persistent state                                                                     |
| `resetDumpHistory` | No                                                                                                                                           | `void`                   | Reset all persistent history states                                                        |
| `saveDump`         | No                                                                                                                                           | `number`                 | Save state dump and get its ID which is represented in number of current time milliseconds |
| `removeDump`       | `timestamp: number`                                                                                                                          | `void`                   | Remove state dump by ID                                                                    |
| `restoreDump`      | `timestamp: number`                                                                                                                          | `void`                   | Replace current state to one from history by ID                                            |
| `getDumpHistory`   | No                                                                                                                                           | `number[]`               | Get dump history IDs                                                                       |
| `getDumpHistory`   | No                                                                                                                                           | `number[]`               | Get dump history IDs                                                                       |

### StoreEvent

#### StoreEvent methods

| Method name | Arguments | Returns | Description                                 |
| ----------- | --------- | ------- | ------------------------------------------- |
| `remove`    | No        | `void`  | Unsubscribe from store state event listener |

#### StoreEventType Enum

| Value         | The event will be emitted                           |
| ------------- | --------------------------------------------------- |
| `All`         | After every other event type emits                  |
| `Init`        | Once, as soon as the event has been bound           |
| `Update`      | Each time after store was updated                   |
| `DumpUpdated` | Each time after persistent store's dump was updated |

## Persistence

A store instance can be persistent from session to session in case you've provided `StorePersistentDriver` to it. React-stores includes built-in `StorePersistentLocalSrorageDriver`.

```typescript
const myStore = new Store<IMyStoreState>(initialState, new StorePersistentLocalSrorageDriver('myStore'));
```

Also, you can implement your own persistence driver by implementing `StorePersistentDriver` abstract class.

## Deprecated entities

### Create a StoreComponent (deprecated)

```typescript jsx
import * as React from 'react';
import {Store, StoreComponent} from 'react-stores';
import {myStore, IMyStoreState} from './myStore';

interface IStoresState {
  myStore: Store<IMyStoreState>;
}

export class MyStoreComponent extends StoreComponent<any, any, IStoresState> {
  constructor(props: any) {
    super(props, {
      myStore,
    });
  }

  private increase = () => {
    this.stores.myStore.setState({
      counter: this.stores.myStore.state.counter + 1,
    });
  };

  render() {
    return (
      <>
        <p>Counter: {this.stores.myStore.state.counter.toString()}</p>
        <button onClick={this.increase}>Increase counter</button>
      </>
    );
  }
}
```

### StoreComponent's lyfecycle proxy methods (deprecated)

These methods are proxies for React.Component lifecycle methods, if you considered using StroeComponent you should use them instead of original ones.

```typescript
storeComponentDidMount(): void
storeComponentWillUnmount(): void
storeComponentWillReceiveProps(nextProps:Props): void
storeComponentWillUpdate(nextProps:Props, nextState:State): void
storeComponentDidUpdate(prevProps:Props, prevState:State): void
shouldStoreComponentUpdate(nextProps:Props, nextState:State): boolean
storeComponentStoreWillUpdate(): void
storeComponentStoreDidUpdate(): void
```

## License

The MIT License (MIT)

Copyright (c) 2017-2019 IBIT LTD.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
