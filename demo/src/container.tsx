import * as React from 'react';
import { Complex } from './complex';
import { Counter } from './counter';
import { CounterEvents } from './counter-events';
import { CounterDecorator } from "./counter-decorator";
import { Persistent } from './persistent';
import { store, storePersistent } from './store';
import { followStore, Store, StorePersistentLocalSrorageDriver } from '../../src/store';

interface Props {

}

interface State {

}

const pageStore: Store<{page: number}> = new Store<{page: number}>({
	page: 0,
}, {
	live: true,
}, new StorePersistentLocalSrorageDriver('page'));

@followStore(pageStore)
export class Container extends React.Component<Props, State> {
	public render() {
		return (
			<>
				<nav className="main-nav">
					<a className={pageStore.state.page === 0 ? 'active' : ''} href="#" onClick={this.handleClick.bind(this, 0)}>Components</a>
					<a className={pageStore.state.page === 1 ? 'active' : ''} href="#" onClick={this.handleClick.bind(this, 1)}>Persistent</a>
					<a className={pageStore.state.page === 2 ? 'active' : ''} href="#" onClick={this.handleClick.bind(this, 2)}>Snapshots</a>
				</nav>

				<div className="inner">
					{pageStore.state.page === 0 && (
						<>
							<h1>Components demo</h1>

							<button onClick={() => store.resetState()}>
								Reset store
							</button>

							<Complex />
							<Counter />
							<CounterEvents />
							<CounterDecorator />
						</>
					)}

					{pageStore.state.page === 1 && (
						<>
							<h1>Persistent store demo</h1>
							
							<button onClick={() => storePersistent.resetPersistence()}>
								Reset persistence
							</button>

							<button onClick={() => storePersistent.resetState()}>
								Reset store
							</button>

							<Persistent />
						</>
					)}

					{pageStore.state.page === 2 && (
						<>
							<h1>Snapshots demo</h1>

							<button onClick={() => store.resetState()}>
								Reset store
							</button>
						</>
					)}
				</div>
			</>
		);
	}

	private handleClick(id, e) {
		e.preventDefault();
		pageStore.setState({
			page: id,
		});
	};
}
