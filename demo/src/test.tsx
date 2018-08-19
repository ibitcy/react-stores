import * as React from 'react';

import { CommonStore } from './store';
import { CommonActions } from './actions';
import { Store, StoreComponent } from '../../src/store';

interface Props {

}

interface State {
	counter: number
}

interface StoresState {
	common: Store<CommonStore.State>
}

export class Test extends StoreComponent<Props, State, StoresState> {
	constructor() {
		super({
			common: CommonStore.store
		});
	}

	state: State = {
		counter: 0
	};

	private plusOne(): void {
		this.setState({
			counter: ++this.state.counter
		});
	}

	public render() {
		return (
			<div>
				<h2>
					Persistence
				</h2>

				<p>
					<button onClick={() => this.stores.common.resetPersistence()}>
						Reset persistence
					</button>

					<button onClick={() => this.stores.common.resetState()}>
						Reset store
					</button>
				</p>

				<h2>
					Test component
				</h2>
				
				<p>Local state counter: {this.state.counter.toString()}</p>
				<p>Shared state counter: {this.stores.common.state.counter.toString()}</p>

				<button onClick={this.plusOne.bind(this)}>
					Local +1
				</button>

				<button onClick={() => { CommonActions.increaseCounter(); }}>
					Shared +1
				</button>

				<button onClick={() => { CommonActions.toggleFooBar(); }}>
					{this.stores.common.state.foo} toggle
				</button>
			</div>
		);
	}
}