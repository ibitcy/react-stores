# react-stores

![react-stores](https://ibitcy.github.io/react-stores/react-stores.svg)

[![build status](https://badgen.net/travis/ibitcy/react-stores?icon=travis)](https://travis-ci.org/ibitcy/react-stores)
[![npm bundlephobia minzip](https://badgen.net/bundlephobia/minzip/react-stores@latest?icon=awesome)
![npm version](https://badgen.net/npm/v/react-stores?icon=npm&color=blue)](https://www.npmjs.com/package/react-stores)
![with types](https://badgen.net/badge/1/typescript/007acc?icon=typescript)
[![devtool extension](https://badgen.net/badge/1/devtool%20extension/cyan?icon=chrome&label)](https://github.com/ibitcy/react-stores-devtools-extension)

Shared states for React.

## How to install

```shell
npm i react-stores --save
```

## Demo

[Online demo](https://ibitcy.github.io/react-stores/)

For local demo clone this repo and run the script below inside the dir, then go to [http://localhost:9000](http://localhost:9000) in your browser

```bash
npm i && npm run demo
```

## Tests

```bash
npm run test
```

## How to use

Here you are a few examples

### Create a Store

```typescript
// myStore.ts
import { Store } from 'react-stores';

export interface IMyStoreState {
  counter: number;
}

export const myStore = new Store<IMyStoreState>({
  counter: 0, // initial state values
});
```

### React useHooks

```typescript jsx
import React, { FC } from 'react';
import { useStore } from 'react-stores';
import { myStore } from './myStore';

export const Component: FC = () => {
  const myStoreState = useStore(myStore);

  return (
    <div>
      {myStoreState.counter}
    <div/>
  );
}

// Invoke this code somewhere outside Component and it will be re-rendered
myStore.setState({
  counter: 2,
});
```

Look here 👉[more about use hooks](#use-includekeys-in-usestore)

### Event-driven component

```typescript jsx
// EventDrivenComponent.tsx
import React from 'react';
import { StoreEvent, StoreEventType } from 'react-stores';
import { myStore, IMyStoreState } from './myStore';

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
    this.storeEvent = myStore.on(
      StoreEventType.All,
      (storeState: IMyStoreState, prevState: IMyStoreState, type: StoreEventType) => {
        this.setState({
          myStoreState: storeState,
        });
      },
    );
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
import React from 'react';
import { followStore } from 'react-stores';
import { myStore } from './myStore';

// You can use multiple follows
// @followStore(myStore)
// @followStore(myOtherStore)
@followStore(myStore)
export class CounterDecorator extends React.Component {
  public render() {
    return <p>Counter: {myStore.state.counter.toString()}</p>;
  }
}
```

### Advanced Component Hooks

```typescript jsx
import React from 'react';
import { useStore } from 'react-stores';
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

export const MyHookComponent: React.FC<IProps> = (props: IProps) => {
  // Memoize your mapState function
  const mapState = React.useCallback(
    (state: IMyStoreState): IMappedState => ({
      counter: recursiveFibonacci(state.counter), // Very long operation
    }),
    [props.index],
  );

  // Get your state form store
  const { counter } = useStore<IMyStoreState, IMappedState>(myStore, mapState);

  return <p>Counter: {counter}</p>;
};
```

### Mutating store state

```typescript
import { myStore } from './myStore';

myStore.setState({
  counter: 9999,
});
```

### Read store state value

```typescript
import { myStore } from './myStore';

console.log(myStore.state.counter); // 9999
```

### useIsolatedStore

```typescript tsx
import React, { FC } from 'react';
import { useIsolatedStore } from 'react-stores';

interface IMyStoreState {
  counter: number;
}

const initialState = {
  counter: 0,
};

export const Component: FC<{ name: sting }> = ({ name }) => {
  const myStore = useIsolatedStore<IMyStoreState>(initialState, {
    persistence: true,
    immutable: true,
    name,
  });

  const handleIncrement = React.useCallback(() => {
    myStore.setState({
      counter: myStore.state.counter + 1,
    });
  }, [myStore.state.counter]);

  return <button onClick={handleIncrement}>{myStore.state.counter}</button>;
};
```

# API

### Store

#### Store constructor

| Argument            | Type                                                                                                                   | Optional | Description                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `initialState`      | [`StoreState`](#storestate)                                                                                            | No       | Initial state values object                                                                                                           |
| `options`           | [`StoreOptions`](#storeoptions)                                                                                        | Yes      | Setup store as you need with immutable, persistence and etс.                                                                          |
| `persistenceDriver` | [`StorePersistentDriver<StoreState>`](https://github.com/ibitcy/react-stores/blob/master/src/StorePersistentDriver.ts) | Yes      | [`StorePersistentDriver<StoreState>`](https://github.com/ibitcy/react-stores/blob/master/src/StorePersistentDriver.ts) class instance |

[Example](#create-a-store)

#### StoreState

This can be any interface describes your store's state.

#### initialState

Any object corresponding to StoreState interface.

#### StoreOptions

| Property          | Type      | Default | Optional | Description                                                                                                                                                                                                                                     |
| ----------------- | --------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `immutable`       | `boolean` | `false` | Yes      | Object.freeze(...) for store state instances, when disabled you have fully mutable states, but increased performance, [for more see](https://ibitcy.github.io/react-stores/?#Performance)                                                       |
| `persistence`     | `boolean` | `false` | Yes      | Enables persistent mode using LocalStorage persistence of custom StorePersistentDriver. If you want use two persistence stores with identical interface you must set `name` props. In other case both of stores will be use one key in storage. |
| `name`            | `string`  | null    | Yes      | Uses for name in storage if persistence flag is true. If name not defined name for persistent will be created from initialState interface.                                                                                                      |
| `setStateTimeout` | `number`  | `0`     | Yes      | Store state updates with timeout                                                                                                                                                                                                                |

#### Store methods

[Check demo here](https://ibitcy.github.io/react-stores/?#Snapshots).

| Method name        | Arguments                                         | Returns                                 | Description                                                                                |
| ------------------ | ------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------ |
| `setState`         | `newState: Partial<StoreState>`                   | `void`                                  | Set store's state to provided new one can be partial                                       |
| `resetState`       | No                                                | `void`                                  | Reset srote to it's `initialState`                                                         |
| `update`           | No                                                | `void`                                  | Force update all bound components and emit events                                          |
| `on`               | eventType, callback\* [+2overload](#on-overloads) | [`StoreEvent<StoreState>`](#storeevent) | Subscribe to store state event listener                                                    |
| `resetPersistence` | No                                                | `void`                                  | Reset persistent state                                                                     |
| `resetDumpHistory` | No                                                | `void`                                  | Reset all persistent history states                                                        |
| `saveDump`         | No                                                | `number`                                | Save state dump and get its ID which is represented in number of current time milliseconds |
| `removeDump`       | `timestamp: number`                               | `void`                                  | Remove state dump by ID                                                                    |
| `restoreDump`      | `timestamp: number`                               | `void`                                  | Replace current state to one from history by ID                                            |
| `getDumpHistory`   | No                                                | `number[]`                              | Get dump history IDs                                                                       |

##### \* Store methods: `on()` arguments

##### `on()` overloads

```typescript
// Use this to get the whole store state
eventType: StoreEventType | StoreEventType[],
callback: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void
```

Use this overload if you need some [optimization](#use-includekeys-in-storeevent).

```typescript
// Use this to get only specific keys
eventType: StoreEventType | StoreEventType[],
includeKeys: Array<keysof StoreState>
callback: (storeState: StoreState, prevState: StoreState, includeKeys: Array<keysof StoreState>, type: StoreEventType) => void
```

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

[Example](#event-driven-component)

### followStore

_We do not recomend use this way to connected with your stores, because it have no any performance techniques_

| Argument | Type                          | Optional | Description    |
| -------- | ----------------------------- | -------- | -------------- |
| `store`  | [`Store<StoreState>`](#store) | No       | followed store |

[Example](#component-with-followstore-decorator)

### useStore

Use useStore only with `store` argument makes many performance issues.
Instead, we recommend using [includeKeys](#use-includekeys-in-usestore) or [mapState](#use-mapstate-in-usestore) for optimizations and custom [compare](#use-compare-in-usestore) for perfect optimization.

| Argument    | Type                                                                                     | Optional | Description                                                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `store`     | [`Store<StoreState>`](#store)                                                            | No       | followed store\*                                                                                                                                                   |
| `eventType` | [`StoreEventType`](#storeeventtype-enum) `\|` [`StoreEventType[]`](#storeeventtype-enum) | Yes      | re-render only on specific events                                                                                                                                  |
| `mapState`  | [`callback`](#mapState)                                                                  | Yes      | The selector function should be pure since it is potentially executed multiple times and at arbitrary points in time.                                              |
| `compare`   | [`callback`](#compare)                                                                   | Yes      | The optional comparison function also enables using something like Lodash's \_.isEqual() or Immutable.js's comparison capabilities. More about [compare](#compare) |

##### \* To have more control over re-renders use eventType, mapState and compare their arguments. See more in [optimization](#optimization).

```typescript jsx
import React from 'react';
import { useStore } from 'react-stores';
import { myStore } from './myStore';

export const CounterComponent = ({ value }) => {
  const store = useStore(myStore);

  // Do not abuse this in a real app with complicated stores.
  // The component will not automatically update if the myStore state changes.
  return <div>{store.anyOfProps}</div>;
};
```

With `includeKeys`. [example](#use-includekeys-in-usestore).

| Argument      | Type                                                                                     | Optional | Description                       |
| ------------- | ---------------------------------------------------------------------------------------- | -------- | --------------------------------- |
| `store`       | [`Store<StoreState>`](#store)                                                            | No       | followed store                    |
| `includeKeys` | `Array<keyof StoreState>`                                                                | No       | followed keys from store          |
| `eventType`   | [`StoreEventType`](#storeeventtype-enum) `\|` [`StoreEventType[]`](#storeeventtype-enum) | Yes      | re-render only on specific events |

Or with [`mapState`](#mapState) and [`compare`](#compare) only. [Example](#use-mapstate-in-usestore).

| Argument   | Type                    | Optional | Description                                                                                                                                                        |
| ---------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `store`    | `Store<StoreState>`     | No       | followed store                                                                                                                                                     |
| `mapState` | [`callback`](#mapState) | No       | The selector function should be pure since it is potentially executed multiple times and at arbitrary points in time.                                              |
| `compare`  | [`callback`](#compare)  | Yes      | The optional comparison function also enables using something like Lodash' `_.isEqual()` or Immutable.js's comparison capabilities. More about [compare](#compare) |

Or use with second argument called options (legacy).

| Argument  | Type                          | Optional | Description                                  |
| --------- | ----------------------------- | -------- | -------------------------------------------- |
| `store`   | `Store<StoreState>`           | No       | followed store                               |
| `options` | [`Object`](#usestore-options) | No       | legacy, use an another [overload](#usestore) |

#### useStore options

This is legacy, please use another useState overload.

| Argument    | Type                                                                                     | Optional | Description                                                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `eventType` | [`StoreEventType`](#storeeventtype-enum) `\|` [`StoreEventType[]`](#storeeventtype-enum) | Yes      | re-render only on specific events                                                                                                                                  |
| `mapState`  | [`callback`](#mapState)                                                                  | Yes      | The selector function should be pure since it is potentially executed multiple times and at arbitrary points in time.                                              |
| `compare`   | [`callback`](#compare)                                                                   | Yes      | The optional comparison function also enables using something like Lodash's \_.isEqual() or Immutable.js's comparison capabilities. More about [compare](#compare) |

#### mapState

This should take the first argument called state, optionally the second argument called prevState, and also takes optionally `type` as the third argument and returns a plain object containing data that connected component(s) listens to. Selector function should be pure since it is potentially executed multiple times and at arbitrary points in time.

```typescript
type TMapState<StoreState, MappedState> = (
  storeState: StoreState,
  prevState?: StoreState,
  type?: StoreEventType,
) => MappedState;
```

#### compare

When store changes, useState() with `mapState` calling a `compare` of the previous `mapState` result value and the current result value. If they are different, the component will be forced to re-render. If they are the same, the component will not re-render. It should return `true` if compared states are equal. By default, it uses strict `===` reference equality checks for next and previous mapped state. It works only if you map primitives. Check this [compare](#use-compare-in-usestore) explanation.

```typescript
type TCompare<MappedState> = (storeMappedState: MappedState, prevStoreMappedState: MappedState) => boolean;
```

### useIsolatedStore

If you want to use isolated persistent stores dynamically with identical interface you must set `name` property inside passed options. In other case both of stores will be use one key in storage. [Check demo here](https://ibitcy.github.io/react-stores/?#Isolated).

| Argument            | Type                                                                                                                   | Optional | Description                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `initialState`      | [`StoreState`](#storestate)                                                                                            | No       | Initial state values object                                                                                                           |
| `options`           | [`StoreOptions`](#storeoptions)                                                                                        | Yes      | Setup store as you need with immutable, persistence and etс.                                                                          |
| `persistenceDriver` | [`StorePersistentDriver<StoreState>`](https://github.com/ibitcy/react-stores/blob/master/src/StorePersistentDriver.ts) | Yes      | [`StorePersistentDriver<StoreState>`](https://github.com/ibitcy/react-stores/blob/master/src/StorePersistentDriver.ts) class instance |

# Persistence

A store instance can be persistent from session to session in case you've provided [`StorePersistentDriver`](https://github.com/ibitcy/react-stores/blob/master/src/StorePersistentDriver.ts) to it. React-stores includes built-in `StorePersistentLocalStorageDriver`, it saves store state into the LocalStore\* using `name` or generated hash-name based on initialState interface. [Check demo here](https://ibitcy.github.io/react-stores/?#Persistent).

\* For React Native you have to provide your own `StorePersistentDriver` see below.

```typescript
const myStore = new Store<IMyStoreState>(initialState, new StorePersistentLocalStorageDriver('myStore'));
```

You can implement your own persistence driver by implementing [`StorePersistentDriver`](https://github.com/ibitcy/react-stores/blob/master/src/StorePersistentDriver.ts) abstract class.

# Optimization

If you need to solve performance problems in the Components connected to stores, react-stores offers you tools to help you fix performance issues. [Check demo here](https://ibitcy.github.io/react-stores/?#optimization).

### Use includeKeys in StoreEvent

You can prevent unnecessary update calls with `includeKeys`.
In this case, events calls [areSimilar function](https://github.com/ibitcy/react-stores/blob/master/src/compare.ts) to compare previous state and next state using only the keys you provided to the `includeKeys` array.

```typescript
comonentDidMount() {
  // You call setState each time when storeState changes even if storeState.mapOfObjects does not exist
  // It's not a big deal while you get only primitives from a store state, like strings or numbers
  this.storeEvent = myStore.on(
    StoreEventType.All,
    (storeState) => {
      this.setState({
        momentousMap: storeState.mapOfObjects,
      });
    },
  );
}
```

```typescript
comonentDidMount() {
  //You can prevent update call for unnecessary keys in
  // and watch only for an important key for this component
  this.storeEvent = myStore.on(
    StoreEventType.All,
    // Watch only for mapOfObjects key from the store
    ['mapOfObjects'],
    (storeState) => {
      // The callback is fired only when mapOfObjects key was changed
      this.setState({
        momentousMap: storeState.mapOfObjects,
      });
    },
  );
}
```

### Use includeKeys in useStore

You can prevent unnecessary update calls with `includeKeys` passed to the `useStore`.
In this case, events calls the [areSimilar function](https://github.com/ibitcy/react-stores/blob/master/src/compare.ts) to compare previous state and next state uses only keys witch you pass into `includeKeys`.

```typescript
// You call setState each time when storeState changes even if storeState.mapOfObjects does not exist
// It's not a big deal when you grab a primitives from store, like a strings or a numbers
const { mapOfObjects } = useStore(myStore, StoreEventType.Update /* Optional */);
```

```typescript
// You can prevent update call for unnecessary keys in the store
// and watch only for important keys for this component
const { mapOfObjects } = useStore(myStore, ['mapOfObjects'], StoreEventType.Update /* Optional */);
```

### Use mapState in useStore

Let's look at this example. In this case, CounterComponent will re-render every time after any of the keys in myStore were changed.
This happens because after changing we get a new copy of the store state and forcing the update.

```typescript jsx
import React from 'react';
import { useStore } from 'react-stores';
import { myStore } from './myStore';

export const CounterComponent = ({ value }) => {
  // Component re-renders when myStore state changes
  const counter = useStore(myStore);

  /*
   * This code executes when myStore state changes
   */
  return <div>{counter}</div>;
};
```

You can use `mapState` function to pick primitives from state and pass them into your component.

```typescript jsx
import React from 'react';
import { useStore } from 'react-stores';
import { myStore } from './myStore';

export const CounterComponent = ({ value }) => {
  // Okay, now component will re-render only when the counter property actually changed
  // mapState function returns primitive
  const counter = useStore(myStore, state => state.counter);

  return <div>{counter}</div>;
};
```

It works because useHook uses strict `===` reference equality that checks next mapped state and previous mapped state. For primitives, it works perfectly, but let's look at this:

```typescript jsx
import React from 'react';
import { useStore } from 'react-stores';
import { myStore } from './myStore';

export const CounterComponent = ({ value }) => {
  // Now component re-renders every time we change store state
  // It is also relevant when you map two or more keys
  const { counter } = useStore(myStore, state => ({ counter: state.counter }));

  /*
   * All this code will be executed when myStore were changed
   */

  return <div>{counter}</div>;
};
```

It happens because mapState(nextState) does not equal the previous mapState, they are different objects. You can fix it with [`compare`](#use-compare-in-usestore) function.

### Use compare in useStore

When you use `mapState` with only few keys, your component will re-render even if keys did not changed. Take a look:

```typescript jsx
import React from 'react';
import { useStore } from 'react-stores';
import { myStore } from './myStore';

export const CounterComponent = ({ value }) => {
  // Now component re-renders every time
  // It is also relevant when you map two or more keys
  const { counter } = useStore(myStore, state => ({ counter: state.counter }));

  /*
   * All this code will be executed when myStore were changed
   */

  return <div>{counter}</div>;
};
```

It happens because mapState(nextState) not equal previous mapState, they are different objects. Let's use `compare` function to fix it.

```typescript jsx
import React from 'react';
import { useStore } from 'react-stores';
// You can use `areSimilar` function exported from react-stores
import { areSimilar } from 'react-stores';
import { myStore } from './myStore';

export const CounterComponent = ({ value }) => {
  // Re-render component only when counter or anotherValue was changed
  const { counter, anotherValue } = useStore(
    myStore,
    state => ({ counter: state.counter, anotherValue: state.anotherValue }),
    // Use your custom compare function to prevent re-renders
    // if the store was changed but mapped values are the same.
    (a, b) => a.counter === b.counter && someCompareFunction(a.anotherValue, b.anotherValue),
  );

  return (
    <div>
      {counter}, {anotherValue.id}
    </div>
  );
};
```

# Debugging

Install [extension for chrome](https://github.com/ibitcy/react-stores-devtools-extension#react-stores-devtools-extension) devtools for better debugging.
