import * as React from 'react';
import {Complex} from './complex';
import {Counter} from './counter';
import {CounterEvents} from './counter-events';
import {CounterDecorator} from './counter-decorator';
import {Persistent} from './persistent';
import {store, storePersistent, storeHistory} from './store';
import {followStore, Store, StorePersistentLocalStorageDriver} from '../../src';
import {History} from './history';

interface Props {}

interface State {
  items: {value: number}[];
}

const pageStore: Store<{page: number}> = new Store<{page: number}>(
  {
    page: 0,
  },
  {
    live: true,
  },
  new StorePersistentLocalStorageDriver('page'),
);

@followStore(pageStore)
export class Container extends React.Component<Props, State> {
  state = {
    items: [],
  };

  public render() {
    return (
      <>
        <nav className="main-nav">
          <a className={pageStore.state.page === 0 ? 'active' : ''} href="#" onClick={this.handleClick.bind(this, 0)}>
            Components
          </a>
          <a className={pageStore.state.page === 1 ? 'active' : ''} href="#" onClick={this.handleClick.bind(this, 1)}>
            Persistent
          </a>
          <a className={pageStore.state.page === 2 ? 'active' : ''} href="#" onClick={this.handleClick.bind(this, 2)}>
            Snapshots
          </a>
        </nav>

        <div className="inner">
          {pageStore.state.page === 0 && (
            <>
              <h1>Components demo</h1>
              <button onClick={() => store.resetState()}>Reset store</button>
              <button onClick={e => this.iterateStateValue(e)}>
                Iterate parent state value <span className="label">{this.state.items.length}</span>
              </button>
              <Complex />
              <Counter items={this.state.items} />
              <CounterEvents />
              <CounterDecorator />
            </>
          )}

          {pageStore.state.page === 1 && (
            <>
              <h1>Persistent store demo</h1>

              <button onClick={() => storePersistent.resetPersistence()}>Reset persistence</button>

              <button onClick={() => storePersistent.resetState()}>Reset store</button>

              <Persistent />
            </>
          )}

          {pageStore.state.page === 2 && (
            <>
              <h1>Snapshots demo</h1>

              <button onClick={() => storeHistory.resetPersistence()}>Reset persistence</button>

              <button onClick={() => storeHistory.resetState()}>Reset store</button>

              <button onClick={() => storeHistory.resetDumpHistory()}>Reset history</button>

              <button onClick={() => storeHistory.saveDump()}>Save dump</button>

              <History />
            </>
          )}
        </div>
      </>
    );
  }

  private iterateStateValue(e) {
    e.preventDefault();
    this.setState({
      items: this.state.items.concat({value: Math.random()}),
    });
  }

  private handleClick(id, e) {
    e.preventDefault();
    pageStore.setState({
      page: id,
    });
  }
}
