import * as React from 'react';

interface Props {

}

interface State {
	counter: number
}

export class Test extends React.Component <Props, State> {
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
				<p>Your likes is: {this.state.counter.toString()}</p>

				<button onClick={this.plusOne.bind(this)}>
					Like +1
				</button>
			</div>
		);
	}
}