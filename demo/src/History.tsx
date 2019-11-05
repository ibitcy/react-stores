import React from 'react';
import { historyStore, StoreState } from './store';
import { StoreEvent, StoreEventType } from '../../src';

interface Props {}

interface State {
  commonStoreState: StoreState;
  dumpHistory: number[];
  counter: number;
}

export class History extends React.Component<Props, State> {
  event: StoreEvent<StoreState> = null;

  state: State = {
    commonStoreState: null,
    dumpHistory: [],
    counter: 0,
  };

  componentDidMount() {
    this.event = historyStore.on(StoreEventType.All, storeState => {
      this.setState({
        commonStoreState: storeState,
      });
    });

    this.event = historyStore.on(StoreEventType.DumpUpdate, storeState => {
      this.setState({
        dumpHistory: historyStore.getDumpHistory(),
      });
    });
  }

  componentWillUnmount() {
    this.event.remove();
  }

  public render() {
    return (
      <>
        <div className='component'>
          <h2>History component</h2>

          <p>
            Local state counter: <strong>{this.state.counter.toString()}</strong>
          </p>
          <p>
            Shared state counter: <strong>{historyStore.state.counter.toString()}</strong>
          </p>

          <p>
            Foo state is: <strong>{historyStore.state.foo}</strong>
          </p>

          <button
            onClick={() => {
              this.setState({
                counter: this.state.counter + 1,
              });
            }}>
            Local +1
          </button>

          <button
            onClick={() => {
              historyStore.setState({
                counter: historyStore.state.counter + 1,
              });
            }}>
            Store +1
          </button>

          <button
            onClick={() => {
              historyStore.setState({
                foo: historyStore.state.foo === 'foo' ? 'bar' : 'foo',
              });
            }}>
            Store foobar toggle
          </button>
        </div>

        <div className='component'>
          <h2>Dump history</h2>

          {this.state.dumpHistory.length > 0 ? (
            <div className='history'>
              <div className='header'>
                <div className='col'>ID</div>

                <div className='col'>Date</div>
              </div>
              {this.state.dumpHistory.map((item, i) => {
                return (
                  <div className='row' key={i}>
                    <div className='col' style={{ width: '20%' }}>
                      {item.toString()}
                    </div>

                    <div className='col' style={{ width: '70%' }}>
                      {new Date(item).toLocaleString()}
                    </div>

                    <div className='col' style={{ width: '5%' }}>
                      <a className='restore' href='#' onClick={this.restore.bind(this, item)}>
                        Restore
                      </a>
                    </div>

                    <div className='col' style={{ width: '5%' }}>
                      <a className='delete' href='#' onClick={this.delete.bind(this, item)}>
                        Delete
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='empty'>History is empty</div>
          )}
        </div>
      </>
    );
  }

  private restore(id, e): void {
    e.preventDefault();
    historyStore.restoreDump(id);
  }

  private delete(id, e): void {
    e.preventDefault();
    historyStore.removeDump(id);
  }
}
