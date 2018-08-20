import * as React from 'react';

import { Store, StoreComponent } from '../../src/store';
import { store, StoreState } from './store';

interface Props {

}

interface State {

}

interface StoresState {
	common: Store<StoreState>
}

export class Counter extends StoreComponent<Props, State, StoresState> {
	constructor(props: Props) {
		super(props, {
			common: store,
		});
	}

	public render() {
		return (
			<div className="component">
				<h2>
					Linked comonent
				</h2>

				<p>Shared state counter: <strong>{this.stores.common.state.counter.toString()}</strong></p>

				<p>
					Foo state is: <strong>{this.stores.common.state.foo}</strong>
				</p>

				<button onClick={() => { 
					store.setState({
						counter: store.state.counter + 1,
					});
				}}>
					Shared +1
				</button>
			</div>
		);
	}
}
