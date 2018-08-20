import * as React from 'react';

import { followStore } from '../../src/store';
import { storePersistent } from './store';

interface Props {

}

interface State {
	counter: number;
}

@followStore(storePersistent)
export class Persistent extends React.Component<Props, State> {
	state: State = {
		counter: 0,
	};

	private plusOne(): void {
		this.setState({
			counter: this.state.counter + 1,
		});
	}

	public render() {
		return (
			<div className="component">
				<h2>
					Persistent store component
				</h2>

				<p>Local state counter: <strong>{this.state.counter.toString()}</strong></p>
				<p>Shared persistent counter: <strong>{storePersistent.state.counter.toString()}</strong></p>
				<p>Shared persistent foo: <strong>{storePersistent.state.foo}</strong></p>

				<button onClick={this.plusOne.bind(this)}>
					Local +1
				</button>

				<button onClick={() => {
					storePersistent.setState({
						counter: storePersistent.state.counter + 1,
					});
				}}>
					Store +1
				</button>

				<button onClick={() => {
					storePersistent.setState({
						foo: storePersistent.state.foo === 'foo' ? 'bar' : 'foo',
					});
				}}>
					Store foobar toggle
				</button>
			</div>
		);
	}
}
