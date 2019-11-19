import { act, cleanup } from '@testing-library/react';
import expect from 'expect';
import expectJsx from 'expect-jsx';

import { areSimilar, StoreEventType, useStore, Store, useIsolatedStore } from '../lib';
import { Actions, hookTester, initialState, storeImmutable, StoreState } from './utils';

expect.extend(expectJsx);

describe('useStore hook', () => {
  beforeEach(() => {
    act(() => {
      storeImmutable.resetState();
    });
    cleanup();
  });

  it('render initial value', () => {
    let counter: number;
    hookTester(() => ({ counter } = useStore(storeImmutable)));

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });

  it('change state after store update', () => {
    const NEXT_COUNTER_VALUE = 2;

    let counter: number;
    hookTester(() => ({ counter } = useStore(storeImmutable)));
    act(() => {
      storeImmutable.setState({
        counter: NEXT_COUNTER_VALUE,
      });
    });
    expect(counter).toEqual(NEXT_COUNTER_VALUE);
  });

  it('affect on right StoreEventType', () => {
    let counter: number;
    hookTester(
      () =>
        ({ counter } = useStore(storeImmutable, {
          eventType: StoreEventType.Init,
        })),
    );

    const NEXT_COUNTER_VALUE = 2;
    act(() => {
      storeImmutable.setState({
        counter: NEXT_COUNTER_VALUE,
      });
    });

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });

  it('mapState function map initial state', () => {
    let foo: string;
    hookTester(
      () =>
        ({ foo } = useStore(storeImmutable, {
          mapState: storeState => ({
            foo: storeState.foo,
          }),
        })),
    );

    expect(foo).toBe(JSON.parse(initialState).foo);
  });

  it('change maped state', () => {
    let foo: string;

    hookTester(
      () =>
        ({ foo } = useStore(storeImmutable, {
          mapState: storeState => ({
            foo: storeState.foo,
          }),
        })),
    );

    const NEXT_FOO_VALUE = 'foo';
    act(() => {
      storeImmutable.setState({
        foo: NEXT_FOO_VALUE,
      });
    });
    expect(foo).toBe(NEXT_FOO_VALUE);
  });

  it('change maped simple state', () => {
    let foo: string;

    hookTester(
      () =>
        (foo = useStore(storeImmutable, {
          mapState: storeState => storeState.foo,
        })),
    );

    const NEXT_FOO_VALUE = 'bar';
    act(() => {
      storeImmutable.setState({
        foo: NEXT_FOO_VALUE,
      });
    });
    expect(foo).toBe(NEXT_FOO_VALUE);
  });

  it('mapState called even if param not changed', () => {
    const rerender = jest.fn();

    hookTester(() => useStore(storeImmutable, [StoreEventType.Update]), rerender);

    act(() => {
      storeImmutable.setState({
        foo: JSON.parse(initialState).foo,
      });
    });

    expect(rerender.mock.calls.length).toBe(1);
  });
});

describe('useStore hook overloads', () => {
  beforeEach(() => {
    act(() => {
      storeImmutable.resetState();
    });
    cleanup();
  });

  it('mapState function overload', () => {
    let foo: string;
    hookTester(
      () =>
        ({ foo } = useStore(storeImmutable, storeState => ({
          foo: storeState.foo,
        }))),
    );

    expect(foo).toBe(JSON.parse(initialState).foo);
  });

  it('affect on right StoreEventType with includeKeys overload ', () => {
    let counter: number;
    hookTester(() => ({ counter } = useStore(storeImmutable, ['counter'], StoreEventType.Init)));

    const NEXT_COUNTER_VALUE = 2;
    act(() => {
      storeImmutable.setState({
        counter: NEXT_COUNTER_VALUE,
      });
    });

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });

  it('affect on right StoreEventType with mapState overload ', () => {
    let counter: number;
    hookTester(
      () => ({ counter } = useStore(storeImmutable, StoreEventType.Init, state => ({ counter: state.counter }))),
    );

    const NEXT_COUNTER_VALUE = 2;
    act(() => {
      storeImmutable.setState({
        counter: NEXT_COUNTER_VALUE,
      });
    });

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });

  it('affect on right StoreEventType with overload function', () => {
    let counter: number;
    hookTester(() => ({ counter } = useStore(storeImmutable, StoreEventType.Init)));

    const NEXT_COUNTER_VALUE = 2;
    act(() => {
      storeImmutable.setState({
        counter: NEXT_COUNTER_VALUE,
      });
    });

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });
});

describe('useStore with compareFunction', () => {
  beforeEach(() => {
    act(() => {
      storeImmutable.resetState();
    });
    cleanup();
  });

  it('not called if mapped param not changed', () => {
    const rerender = jest.fn();

    hookTester(
      () =>
        useStore(
          storeImmutable,
          (state: StoreState) => ({ foo: state.foo }),
          (a, b) => a.foo === b.foo,
        ),
      rerender,
    );

    act(() => {
      storeImmutable.setState({
        foo: JSON.parse(initialState).foo,
      });
    });
    act(() => {
      storeImmutable.setState({
        foo: 'bar',
      });
    });

    expect(rerender.mock.calls.length).toBe(1);
  });

  it('called once if mapped param changed', () => {
    const rerender = jest.fn();

    hookTester(
      () =>
        useStore(
          storeImmutable,
          (state: StoreState) => ({ foo: state.foo }),
          (a, b) => a.foo === b.foo,
        ),
      rerender,
    );

    act(() => {
      storeImmutable.setState({
        foo: 'bar',
      });
    });

    expect(rerender.mock.calls.length).toBe(1);
  });

  it('called once if both of mapped params changed', () => {
    const rerender = jest.fn();

    hookTester(
      () =>
        useStore(
          storeImmutable,
          (state: StoreState) => ({ foo: state.foo, counter: state.counter }),
          (a, b) => a.foo === b.foo && a.counter === b.counter,
        ),
      rerender,
    );

    act(() => {
      storeImmutable.setState({
        foo: 'bar',
        counter: 15,
      });
    });

    expect(rerender.mock.calls.length).toBe(1);
  });

  it('areSimilar as compareFunction with mapping object', () => {
    const rerender = jest.fn();

    hookTester(
      () => useStore(storeImmutable, (state: StoreState) => ({ settings: state.settings }), areSimilar),
      rerender,
    );

    act(() => {
      storeImmutable.setState({
        foo: JSON.parse(initialState).foo,
      });
    });

    expect(rerender.mock.calls.length).toBe(0);
  });

  it('areSimilar as compareFunction with mapping deep object', () => {
    const rerender = jest.fn();

    hookTester(
      () => useStore(storeImmutable, (state: StoreState) => ({ settings: state.settings }), areSimilar),
      rerender,
    );

    act(() => {
      Actions.setSettings(100, 200);
    });
    act(() => {
      Actions.setSettings(100, 200);
    });

    expect(rerender.mock.calls.length).toBe(1);
  });
});

describe('useStore hook with includeKeys', () => {
  beforeEach(() => {
    act(() => {
      storeImmutable.resetState();
    });
    cleanup();
  });

  it('update not called if mapped param not changed', () => {
    const rerender = jest.fn();

    hookTester(() => useStore(storeImmutable, ['foo']), rerender);

    act(() => {
      storeImmutable.setState({
        foo: JSON.parse(initialState).foo,
      });
    });

    expect(rerender.mock.calls.length).toBe(0);
  });

  it('change neighbor object, dont update', () => {
    const rerender = jest.fn();

    hookTester(() => useStore(storeImmutable, ['foo']), rerender);

    act(() => {
      Actions.setSettings(100, 200);
    });

    expect(rerender.mock.calls.length).toBe(0);
  });

  it('change mapped object param', () => {
    const rerender = jest.fn();

    hookTester(() => useStore(storeImmutable, ['foo', 'settings']), rerender);

    act(() => {
      Actions.setSettings(100, 200);
    });

    expect(rerender.mock.calls.length).toBe(1);
  });

  it('update both included params', () => {
    const rerender = jest.fn();

    hookTester(() => useStore(storeImmutable, ['foo', 'settings']), rerender);

    act(() => {
      Actions.setSettings(100, 200);
    });
    act(() => {
      storeImmutable.setState({
        foo: 'bar',
      });
    });

    expect(rerender.mock.calls.length).toBe(2);
  });

  it('deep update object', () => {
    const rerender = jest.fn();

    hookTester(() => useStore(storeImmutable, ['objectsArray']), rerender);

    act(() => {
      let newObjArr = [...storeImmutable.state.objectsArray];
      newObjArr[0] = {
        test: 1,
      };

      storeImmutable.setState({
        objectsArray: newObjArr,
      });
    });

    expect(rerender.mock.calls.length).toBe(1);
  });

  it('correct mapped param', () => {
    let foo: string;
    hookTester(() => ({ foo } = useStore(storeImmutable, ['foo'])));

    act(() => {
      Actions.toggleFooBar();
    });

    expect(foo).toBe('bar');
  });
});

describe('useIsolatedStore hook', () => {
  beforeEach(() => {
    cleanup();
  });

  it('create store correct', () => {
    let storeInstance: Store<StoreState>;
    hookTester(() => (storeInstance = useIsolatedStore<StoreState>(JSON.parse(initialState))));

    expect(storeInstance.state.counter).toEqual(JSON.parse(initialState).counter);
  });

  it('mutate store', () => {
    let storeInstance: Store<StoreState>;

    hookTester(() => (storeInstance = useIsolatedStore<StoreState>(JSON.parse(initialState))));

    const nextValue = 5;
    act(() => {
      storeInstance.setState({
        counter: nextValue,
      });
    });
    expect(storeInstance.state.counter).toEqual(nextValue);
  });

  it('rerenders', () => {
    let storeInstance: Store<StoreState>;
    const rerender = jest.fn();

    hookTester(() => (storeInstance = useIsolatedStore<StoreState>(JSON.parse(initialState))), rerender);

    const nextValue = 5;
    act(() => {
      storeInstance.setState({
        counter: nextValue,
      });
    });
    expect(rerender.mock.calls.length).toEqual(2);
  });
});
