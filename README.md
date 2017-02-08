![react-stores](https://ibitcy.github.io/react-stores/react-stores.svg)

# react-stores
Shared states for React.js (a flux-way shared stores without actions and dispatchers).

## How to install
```
npm i react-stores --save
```

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
    let initialState: State = {
        counter: 0
    };

    export let store: Store<State> = new Store<State>(initialState);
}
```

Then you need to create a `StoreComponent` that will use store singleton
```typescript
// component.tsx
import * as React from "react";
import {StoreComponent, Store} from "react-stores";
import {CommonStore} from "store.ts";

interface Props {
    name: string
}
Ок
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
    
    // This method is required by abstract method in StoreComponent it works as default React.Component.componentDidMount()
    storeComponentDidMount() {

    }
    
    // This method is required by abstract method in StoreComponent it works as default React.Component.componentWillUnmount()
    storeComponentWillUnmount() {

    }

    private increaseCommon():void {
        // You can mutate stores as local component state values
        this.stores.common.setState({
            counter: this.stores.common.state.counter + 1
        };
    }

    private increaseLocal():void {
        // You can use local state as natural React.Component
        this.setState({
            counter: this.state.counter + 1
        });
    }

    render() {
        return (
            <div>
                <p>Component name: {this.props.name}</p>
	            <p>Shared counter value: {this.stores.common.state.counter.toString()}</p>
                <p>Local counter value: {this.state.counter.toString()}</p>

                <button onClick={this.increaseCommon.bind(this)})}>Increase common counter value</button>
                <button onClick={this.increaseLocal.bind(this)})}>Increase local counter value</button>
            </div>
        );
    }
}
```

## ES5/5
Usage example on [RunKit](https://runkit.com/589af3775af6a4001487d9de/589af3775af6a4001487d9df)