import * as React from 'react';

import {CommonActions} from './actions';
import {followStore} from '../../src/store';
import {CommonStore} from './store';

interface Props {
}

interface State {
}

@followStore(CommonStore.store, ['counter'])
export class CounterDecorator extends React.Component<Props, State> {
	public render() {
		return (
			<div>
				<h2>
					Component with store decorator
				</h2>

				<p>
					Shared state counter: {CommonStore.store.state.counter.toString()}
				</p>

				<button onClick={() => {
					CommonActions.increaseCounter();
				}}>
					Shared +1
				</button>
			</div>
		);
	}
}