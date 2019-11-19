import * as React from 'react';
import { render, act } from '@testing-library/react';
import { Store } from '../lib';

export const initialState = `{"nullObj":null,"counter":0,"foo":"foo","numericArray":[1,2,3],"objectsArray":[{"a":1,"b":2,"c":3},{"a":3,"b":2,"c":{"a":1,"b":[1,2,3]},"d":[{"id":1,"name":"test 1","enabled":true},{"id":2,"name":"test 2","enabled":false}]}],"settings":{"foo":{"bar":1},"baz":2}}`;

export const storeImmutable = new Store<StoreState>(JSON.parse(initialState), { immutable: true });
export const storeMutable = new Store<StoreState>(JSON.parse(initialState), { immutable: false });

export function callTimes(callback: () => any, times: number): void {
  new Array(times).fill(1).forEach(callback);
}

export function HookTester({ callback, onRerender }) {
  const isFirstRender = React.useRef(true);
  callback();

  if (!isFirstRender.current) {
    onRerender();
  }

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return null;
}

export const hookTester = (callback: () => any, onRerender = () => {}) => {
  act(() => {
    render(<HookTester callback={callback} onRerender={onRerender} />);
  });
};

export class Actions {
  public static increaseCounter(): void {
    storeImmutable.setState({
      counter: storeImmutable.state.counter + 1,
    });
  }

  public static toggleFooBar(): void {
    let newState: Partial<StoreState> = {
      foo: storeImmutable.state.foo === 'foo' ? 'bar' : 'foo',
    };

    storeImmutable.setState(newState);
  }

  public static reset(): void {
    storeImmutable.resetState();
  }

  public static setSettings(bar: number, baz: number): void {
    storeImmutable.setState({
      settings: {
        foo: {
          bar: bar,
        },
        baz: baz,
      },
    });
  }

  public static setNull(obj: null) {
    storeImmutable.setState({
      nullObj: obj,
    });
  }
}

export interface StoreState {
  nullObj: null;
  counter: number;
  foo: string;
  numericArray: number[];
  objectsArray: Object[];
  settings: {
    foo: {
      bar: number;
    };
    baz: number;
  };
}
