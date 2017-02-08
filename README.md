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
import {CommonStore} from "./store.ts";

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
    
    // This method is required by abstract method in StoreComponent
    //it works as default React.Component.componentDidMount()
    storeComponentDidMount() {

    }
    
    // This method is required by abstract method in StoreComponent
    // it works as default React.Component.componentWillUnmount()
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

                <button onClick={this.increaseCommon.bind(this)}>Increase common counter value</button>
                <button onClick={this.increaseLocal.bind(this)}>Increase local counter value</button>
            </div>
        );
    }
}
```

Now you can use it as usial
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
let newState:CommonStore.State = {
	counter: 100500
}

CommonActions.increaseCounter(newState);
```

Also you can get store state values from everywhere in your app
```typescript
import {CommonStore} from "./store";

console.log(CommonStore.store.state.counter);
```

## ES5/6
Usage example on [RunKit](https://runkit.com/589af3775af6a4001487d9de/589af3775af6a4001487d9df)

##License

The MIT License (MIT)

Copyright (c) 2016 IBIT LTD.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
