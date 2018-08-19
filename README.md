![react-stores](https://ibitcy.github.io/react-stores/react-stores.svg)

# react-stores
[![Build Status](https://travis-ci.org/ibitcy/react-stores.svg?branch=master)](https://travis-ci.org/ibitcy/react-stores)
[![npm version](https://badge.fury.io/js/react-stores.svg)](https://badge.fury.io/js/react-stores)

Shared states for React.js (a flux-way shared stores without actions and dispatchers).

## How to install
`yarn add react-stores` or `npm i react-stores --save`

## Demo
1. Clone this repo
2. `cd` into it
3. `yarn install` or `npm i`
4. `npm run demo`
5. `localhost:9000` in your browser

[Online demo](https://ibitcy.github.io/react-stores/)

## Tests
`npm run test`

## How to use
First you need to create a `Store` singleton
```typescript
// store.ts
import {Store} from "react-stores";

export namespace CommonStore {
    // State interface
    export interface State {
        counter: number
    }

    // Store's state initial values
    const initialState: State = {
        counter: 0
    };

    export let store: Store<State> = new Store<State>(initialState);
}
```

Then you need to create a `StoreComponent` that will use store singleton
```typescript jsx
// component.tsx
import * as React from "react";
import {StoreComponent, Store} from "react-stores";
import {CommonStore} from "./store";

interface Props {
    name: string
}

interface State {
    counter: number
}

interface StoresState {
    common: Store<CommonStore.State>
}

export class App extends StoreComponent<Props, State, StoresState> {
    constructor() {
        super({
            common: CommonStore.store
        });
    }

    private increaseCommon():void {
        // You can mutate stores as local component state values
        this.stores.common.setState({
            counter: this.stores.common.state.counter + 1
        });
    }

    private increaseLocal():void {
        // Also you can use local state as natural React.Component
        this.setState({
            counter: this.state.counter + 1
        });
    }

    render() {
        return (
            <div>
                <p>Component name: {this.props.name}</p>
	            <p>Common counter value: {this.stores.common.state.counter.toString()}</p>
                <p>Local counter value: {this.state.counter.toString()}</p>

                <button onClick={this.increaseCommon.bind(this)}>Increase common counter value</button>
                <button onClick={this.increaseLocal.bind(this)}>Increase local counter value</button>
            </div>
        );
    }
}
```

v1.2.0 Event driven component–store connection
```typescript jsx
import * as React from "react";
import {StoreComponent, Store, StoreEventType, StoreEvent} from "react-stores";
import {CommonStore} from "./store";

interface Props {

}

interface State {
    commonStoreState: CommonStore.State
}

export class App extends React.Component<Props, State> {
    private storeEvent: StoreEvent<CommonStore.State> = null;

    state: State = {
        commonStoreState: null
    }

    comonentDidMount() {
        // Add store state event binder
        this.storeEvent = CommonStore.store.on(StoreEventType.storeUpdated, (storeState: StoreState, prevState: StoreState) => {
            this.setState({
                commonStoreState: storeState
            });
        });
    }

    componentDidUnmount() {
        // Remove store state event binder
        this.storeEvent.remove();
    }

    render() {
        return (
            <div>
	            <p>Common counter value: {this.state.commonStoreState.counter.toString()}</p>
            </div>
        );
    }
}
```

v1.3.0 Decorator for make React Component React Sores driven. You can use multiple
```typescript jsx
@followStore(CommonStore.store, ['counter']) // follow for only "counter" store state
@followStore(SomeOtherStore.store) // follow for all store's states 
export class CounterDecorator extends React.Component<Props, State> {
	public render() {
		return (
			<div>
				<p>
					Shared state counter: {CommonStore.store.state.counter.toString()}
				</p>
			</div>
		);
	}
}
```

Now you can use it as usual
```typescript
import {App} from "./component";

ReactDOM.render(
	React.createElement(App),
	document.getElementById('app')
);
```

You can mutate states from any point of your app like this
```typescript
import {CommonStore} from "./store";

CommonStore.store.setState({
	counter: 100500
});
```

...or even like a flux actions
```typescript
import {CommonStore} from "./store";

export class CommonActions {
	static increaseCounter(state:CommonStore.State):void {
		CommonStore.store.setState(state);
	}
}

// Note that you always have your store interface, you haven't lost typization consistency 
// of your app like it always occurs in Flux/Redux apps in action -> store communication
let newState: CommonStore.State = {
	counter: 100500
}

CommonActions.increaseCounter(newState);
```

Also you can get store state values from everywhere in your app
```typescript
import {CommonStore} from "./store";

console.log(CommonStore.store.state.counter);
```

## API

### StoreComponent lyfecycle
```typescript
storeComponentDidMount(): void
```

```typescript
storeComponentWillUnmount(): void
```

```typescript
storeComponentWillReceiveProps(nextProps:Props): void
```

```typescript
storeComponentWillUpdate(nextProps:Props, nextState:State): void
```

```typescript
storeComponentDidUpdate(prevProps:Props, prevState:State): void
```

```typescript
shouldStoreComponentUpdate(nextProps:Props, nextState:State): boolean
```

```typescript
storeComponentStoreWillUpdate(): void
```

```typescript
storeComponentStoreDidUpdate(): void
```


### Store
```typescript
constructor<StoreState>(initialState<StoreState>, options: StoreOptions);
```

```typescript
interface StoreOptions {
  /* 
    Populated from Freezer.
    With live mode on, freezer emits the update events just when the changes happen, instead of batching all the changes and emiting the event on the next tick. This is useful if you want freezer to store input field values.
  */
  live?: boolean; // (default: false)

  /*
    Populated from Freezer.
    It's possible to store class instances in freezer. They are handled like strings or numbers, added to the state like non-frozen leaves. Keep in mind that if their internal state changes, freezer won't emit any update event. If you want freezer to handle them as freezer nodes, set 'freezerInstances: true'. They will be frozen and you will be able to update their attributes using freezer methods, but remember that any instance method that update its internal state may fail (the instance is frozen) and wouldn't emit any update event.
  */
  freezeInstances?: boolean; // (default: false)

  /*
    Populated from Freezer.
    Once you get used to freezer, you can see that immutability is not necessary if you learn that you shouldn't update the data directly. In that case, disable immutability in the case that you need a small performance boost.
  */
  mutable?: boolean; // (default: false)
}
```

```typescript
setState(newState: StoreState): void // Set store's state to provided new one
```

```typescript
resetState(): void // Reset srote to it's initialState
```

```typescript
resetPersistence(): void // Reset persistent data
```

```typescript
update(): void // Force update all binded components
```

```typescript
on(eventType: StoreEventType | StoreEventType[], callback: (storeState: StoreState, prevState: StoreState, type: StoreEventType) => void): StoreEvent<StoreState> // State event binder
```


### StoreEvent
```typescript
remove(): void
```


### StoreEventType
```
'all' // fires with every other events (init or update)
'init' // fires once at as soon as event has bound
'update' // fires at each store update
```

## Persistence
```
export let store: Store<State> = new Store<State>(initialState, new StorePersistantLocalSrorageDriver('comon'));
```

### Persistent driver
```
abstract class StorePersistantDriver<StoreState> {
  constructor(readonly name: string) {}

  public abstract write(state: StoreState): void;
  public abstract read(): StoreState;
}
```

## ES5/6
Usage example on [RunKit](https://runkit.com/589af3775af6a4001487d9de/589af3775af6a4001487d9df)

## License

The MIT License (MIT)

Copyright (c) 2017 IBIT LTD.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
