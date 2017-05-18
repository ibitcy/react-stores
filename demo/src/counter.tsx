import * as React from 'react';

import { CommonActions } from './actions';

import { Store, StoreComponent } from '../../src/store';
import { CommonStore } from './store';

interface Props {

}

interface State {

}

interface StoresState {
	common: Store<CommonStore.State>
}

export class Counter extends StoreComponent<Props, State, StoresState> {
	constructor() {
		super({
			common: CommonStore.store
		});
	}

	public render() {
		return (
			<div>
                <h2>
                    Another comonent
                </h2>

				<p>
					FooBar state is <strong>{this.stores.common.state.foo}</strong>
				</p>

				<p>Shared state counter: {this.stores.common.state.counter.toString()}</p>

				<button onClick={() => { CommonActions.increaseCounter(); }}>
					Shred +1
				</button>
			</div>
		);
	}
}