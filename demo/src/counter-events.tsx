import * as React from 'react';

import { CommonActions } from './actions';
import { Store, StoreComponent, StoreEventType, StoreEvent } from '../../src/store';
import { CommonStore } from './store';

interface Props {

}

interface State {
	commonStoreState: CommonStore.State
}

export class CounterEvents extends React.Component<Props, State> {
	event: StoreEvent<CommonStore.State> = null;

	state: State = {
		commonStoreState: null
	};

	componentDidMount() {
		this.event = CommonStore.store.on(StoreEventType.storeUpdated, (storeState: CommonStore.State) => {
			this.setState({
				commonStoreState: storeState
			});
		});
	}

	componentWillUnmount() {
		this.event.remove();
	}

	public render() {
		if(this.state.commonStoreState) {
			return (
				<div>
					<h2>
						Another comonent with event driven states
					</h2>

					<p>
						Shared state counter: {this.state.commonStoreState.counter.toString()}
					</p>

					<button onClick={() => { CommonActions.increaseCounter(); }}>
						Shred +1
					</button>
				</div>
			);
		} else {
			return null;
		}
	}
}