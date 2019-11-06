import expect from 'expect';
import expectJsx from 'expect-jsx';
import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { Store, StoreEventType, useStore } from '../src';

const initialState = `{"nullObj":null,"counter":0,"foo":"foo","numericArray":[1,2,3],"objectsArray":[{"a":1,"b":2,"c":3},{"a":3,"b":2,"c":{"a":1,"b":[1,2,3]},"d":[{"id":1,"name":"test 1","enabled":true},{"id":2,"name":"test 2","enabled":false}]}],"settings":{"foo":{"bar":1},"baz":2}}`;

const store = new Store<StoreState>(JSON.parse(initialState), { mutable: false });
const storeMutable = new Store<StoreState>(JSON.parse(initialState), { mutable: true });

class Actions {
  public static increaseCounter(): void {
    store.setState({
      counter: store.state.counter + 1,
    });
  }

  public static toggleFooBar(): void {
    let newState: Partial<StoreState> = {
      foo: store.state.foo === 'foo' ? 'bar' : 'foo',
    };

    store.setState(newState);
  }

  public static reset(): void {
    store.resetState();
  }

  public static setSettings(bar: number, baz: number): void {
    store.setState({
      settings: {
        foo: {
          bar: bar,
        },
        baz: baz,
      },
    });
  }

  public static setNull(obj: null) {
    store.setState({
      nullObj: obj,
    });
  }
}

interface StoreState {
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

expect.extend(expectJsx);

describe('testStoreState', () => {
  it('check store id', done => {
    store.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    expect(store.id).toEqual('-1a3306b2');
    done();
  });

  it('counter should be 4', done => {
    store.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    expect(store.state.counter).toEqual(4);
    done();
  });

  it('foo should be bar', done => {
    store.resetState();
    Actions.toggleFooBar();

    expect(store.state.foo).toEqual('bar');
    done();
  });

  it('foo should be resetted to foo', done => {
    store.resetState();
    Actions.toggleFooBar();
    store.resetState();

    expect(store.state.foo).toEqual('foo');
    done();
  });

  it('counter should be resetted to 0', done => {
    store.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    store.resetState();

    expect(store.state.counter).toEqual(0);
    done();
  });

  it('bar should be set to 100', done => {
    store.resetState();
    Actions.setSettings(100, 200);

    expect(store.state.settings.foo.bar).toEqual(100);
    done();
  });

  it('baz should be set to 200', done => {
    store.resetState();
    Actions.setSettings(100, 200);

    expect(store.state.settings.baz).toEqual(200);
    done();
  });

  it('bar should be reset to 1', done => {
    store.resetState();
    Actions.setSettings(100, 200);
    store.resetState();

    expect(store.state.settings.foo.bar).toEqual(1);
    done();
  });

  it('nullObj should be null', done => {
    store.setState({
      nullObj: undefined,
    });

    store.resetState();
    Actions.setNull(null);

    expect(store.state.nullObj).toEqual(null);
    done();
  });

  it('store init test', done => {
    store.resetState();

    const result: string = JSON.stringify(store.state);
    const etalon: string = JSON.stringify(JSON.parse(initialState));

    expect(result).toEqual(etalon);
    done();
  });

  it('update numeric collection', done => {
    store.resetState();

    const newNumericArray = [3, 2];

    store.setState({
      numericArray: newNumericArray,
    });

    const result: string = JSON.stringify(store.state.numericArray);
    const etalon: string = JSON.stringify(newNumericArray);

    expect(result).toEqual(etalon);
    done();
  });

  it('update objects collection', done => {
    store.resetState();

    const newObjectsArray: Object[] = [
      {
        x: 1,
        y: 2,
        z: 3,
      },
      {
        x: 3,
        y: 2,
        z: {
          a: 1,
          b: [true, false, null],
        },
      },
    ];

    store.setState({
      objectsArray: newObjectsArray,
    });

    const result: string = JSON.stringify(store.state.objectsArray);
    const etalon: string = JSON.stringify(newObjectsArray);

    expect(result).toEqual(etalon);
    done();
  });

  it('mutable test', done => {
    store.resetState();

    let objectsArrayFromStore: Object[] = store.state.objectsArray;

    objectsArrayFromStore = [
      {
        id: 0,
        foo: 1,
        bar: {
          baz: 123,
        },
      },
      [],
      [],
      [],
      {
        id: 1,
      },
    ];

    const result: string = JSON.stringify(store.state.objectsArray);
    const etalon: string = JSON.stringify(store.getInitialState().objectsArray);

    expect(result).toEqual(etalon);
    done();
  });

  it('deep array object', done => {
    store.resetState();

    const objectsArray: Object[] = store.state.objectsArray.concat();

    objectsArray[1] = [];

    store.setState({
      objectsArray,
    });

    const result: string = JSON.stringify([]);
    const etalon: string = JSON.stringify(store.state.objectsArray[1]);

    expect(result).toEqual(etalon);
    done();
  });

  it('event driven', done => {
    store.resetState();

    let counter: string = null;

    const event = store.on(StoreEventType.Update, storeState => {
      counter = storeState.counter.toString();
    });

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    event.remove();

    expect(counter).toEqual('4');

    done();
  });

  it('store state replace', done => {
    store.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    Actions.setSettings(100, 200);
    Actions.toggleFooBar();

    const result: string = JSON.stringify(store.state);
    const etalon: string = JSON.stringify({
      nullObj: null,
      counter: 4,
      foo: 'bar',
      numericArray: [1, 2, 3],
      objectsArray: [
        {
          a: 1,
          b: 2,
          c: 3,
        },
        {
          a: 3,
          b: 2,
          c: {
            a: 1,
            b: [1, 2, 3],
          },
          d: [{ id: 1, name: 'test 1', enabled: true }, { id: 2, name: 'test 2', enabled: false }],
        },
      ],
      settings: {
        foo: {
          bar: 100,
        },
        baz: 200,
      },
    });

    expect(result).toEqual(etalon);
    done();
  });

  it('store state reset', done => {
    store.setState({
      foo: 'asdasd',
      counter: 12123123,
    });

    store.resetState();

    const result: string = JSON.stringify(store.state);
    const etalon: string = JSON.stringify({
      nullObj: null,
      counter: 0,
      foo: 'foo',
      numericArray: [1, 2, 3],
      objectsArray: [
        {
          a: 1,
          b: 2,
          c: 3,
        },
        {
          a: 3,
          b: 2,
          c: {
            a: 1,
            b: [1, 2, 3],
          },
          d: [{ id: 1, name: 'test 1', enabled: true }, { id: 2, name: 'test 2', enabled: false }],
        },
      ],
      settings: {
        foo: {
          bar: 1,
        },
        baz: 2,
      },
    });

    expect(result).toEqual(etalon);
    done();
  });

  it('update trigger', done => {
    store.resetState();

    let updated: string = 'false';

    store.on(StoreEventType.Update, storeState => {
      updated = 'true';
    });

    store.setState({
      counter: 0,
    });

    expect(updated).toEqual('true');
    done();
  });

  it('previous state', done => {
    store.resetState();

    let prev = '0';

    const event = store.on(StoreEventType.Update, (storeState, prevState, type) => {
      prev = prevState.counter.toString();
    });

    store.setState({
      counter: 5,
    });

    event.remove();

    expect(prev).toEqual('0');
    done();
  });

  it('update event trigger', done => {
    store.resetState();

    let eventType = null;

    const event = store.on(StoreEventType.Update, (storeState, prevState, type) => {
      eventType = type;
    });

    store.setState({
      counter: 100,
    });

    event.remove();

    expect(eventType).toEqual(StoreEventType.Update);
    done();
  });

  it('init event trigger', done => {
    store.resetState();

    let eventType = null;

    const event = store.on(StoreEventType.Init, (storeState, prevState, type) => {
      eventType = type;
    });

    event.remove();

    expect(eventType).toEqual(StoreEventType.Init);
    done();
  });

  it('all event trigger', done => {
    store.resetState();

    let eventCount = 0;

    const event = store.on(StoreEventType.All, (storeState, prevState, type) => {
      eventCount++;
    });

    store.setState({
      counter: 100,
    });

    event.remove();

    expect(eventCount).toEqual(3);
    done();
  });

  it('update counter', done => {
    store.resetState();

    let eventCount = 0;

    const event = store.on(StoreEventType.Update, (storeState, prevState, type) => {
      if (type !== StoreEventType.DumpUpdate) {
        eventCount++;
      }
    });

    store.setState({
      counter: 0,
    });

    store.setState({
      counter: 0,
    });

    store.setState({
      counter: 0,
    });

    event.remove();

    expect(eventCount).toEqual(3);
    done();
  });

  it('bulk update count', done => {
    store.resetState();

    let eventCount = 0;

    const event = store.on(StoreEventType.Update, () => {
      eventCount++;
    });

    store.setState({
      nullObj: null,
      counter: 0,
      foo: 'foo',
      numericArray: [1, 2, 3],
    });

    event.remove();

    expect(eventCount).toEqual(1);
    done();
  });

  it('deep objects mutation', done => {
    store.resetState();

    const newObjArr = store.state.objectsArray.concat();

    newObjArr[0] = {
      test: 1,
    };

    store.setState({
      objectsArray: newObjArr,
    });

    expect(JSON.stringify(store.state.objectsArray[0])).toEqual('{"test":1}');
    done();
  });

  it('objects direct assign throw', done => {
    store.resetState();

    expect(() => {
      store.state.objectsArray = null;
    }).toThrow();

    done();
  });

  it('objects direct assign throw', done => {
    store.resetState();

    expect(() => {
      store.state.objectsArray = null;
    }).toThrow();

    done();
  });

  it('deep objects direct assign throw', done => {
    store.resetState();

    expect(() => {
      store.state.objectsArray[0] = 123;
    }).toThrow();

    done();
  });

  it('deep object direct assign mutable', done => {
    storeMutable.resetState();

    storeMutable.state.objectsArray[0] = 123456;

    expect(JSON.stringify(storeMutable.state.objectsArray[0])).toEqual('123456');

    done();
  });

  it('deep objects instance mutations immutable', done => {
    store.resetState();

    const newObjArr1 = store.state.objectsArray.concat();
    const TheClass = function(a) {
      this.a = a;
      this.setA = function(a) {
        this.a = a;
      };
    };

    newObjArr1[0] = new TheClass(1);
    store.setState({
      objectsArray: newObjArr1,
    });
    expect(store.state.objectsArray[0]['a']).toEqual(1);

    const newObjArr2 = store.state.objectsArray.concat();

    expect(() => {
      newObjArr2[0]['a'] = 2;
    }).toThrow();

    store.setState({
      objectsArray: newObjArr2,
    });
    expect(store.state.objectsArray[0]['a']).toEqual(1);

    const newObjArr3 = store.state.objectsArray.concat();

    expect(() => {
      newObjArr3[0]['setA'](3);
    });

    store.setState({
      objectsArray: newObjArr3,
    });
    expect(store.state.objectsArray[0]['a']).toEqual(1);

    done();
  });

  it('deep objects instance mutations mutable', done => {
    storeMutable.resetState();

    const newObjArr1 = storeMutable.state.objectsArray.concat();
    const TheClass = function(a) {
      this.a = a;
      this.setA = function(a) {
        this.a = a;
      };
    };

    newObjArr1[0] = new TheClass(1);
    storeMutable.setState({
      objectsArray: newObjArr1,
    });
    expect(storeMutable.state.objectsArray[0]['a']).toEqual(1);

    const newObjArr2 = storeMutable.state.objectsArray.concat();
    newObjArr2[0]['a'] = 2;
    storeMutable.setState({
      objectsArray: newObjArr2,
    });
    expect(storeMutable.state.objectsArray[0]['a']).toEqual(2);

    const newObjArr3 = storeMutable.state.objectsArray.concat();
    newObjArr3[0]['setA'](3);
    storeMutable.setState({
      objectsArray: newObjArr3,
    });
    expect(storeMutable.state.objectsArray[0]['a']).toEqual(3);

    done();
  });
});

describe('useStore hook', () => {
  afterEach(() => {
    act(() => {
      store.resetState();
    });
    cleanup();
  });

  it('Should render initial value', () => {
    let counter: number;
    hookTester(() => ({ counter } = useStore(store)));

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });

  it('Should change state after store update', () => {
    const NEXT_COUNTER_VALUE = 2;

    let counter: number;
    hookTester(() => ({ counter } = useStore(store)));
    act(() => {
      store.setState({
        counter: NEXT_COUNTER_VALUE,
      });
    });
    expect(counter).toEqual(NEXT_COUNTER_VALUE);
  });

  it('Should affect on right StoreEventType', () => {
    let counter: number;
    hookTester(
      () =>
        ({ counter } = useStore(store, {
          eventType: StoreEventType.Init,
          mapState: storeState => storeState,
        })),
    );

    const NEXT_COUNTER_VALUE = 2;
    act(() => {
      store.setState({
        counter: NEXT_COUNTER_VALUE,
      });
    });

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });

  it('Should map state', () => {
    let foo: string;
    hookTester(
      () =>
        ({ foo } = useStore<StoreState, { foo: string }>(store, {
          mapState: storeState => ({
            foo: storeState.foo,
          }),
        })),
    );

    expect(foo).toBe(JSON.parse(initialState).foo);
  });

  it('Should change maped state', () => {
    let foo: string;

    hookTester(
      () =>
        ({ foo } = useStore<StoreState, { foo: string }>(store, {
          mapState: storeState => {
            return {
              foo: storeState.foo,
            };
          },
        })),
    );

    const NEXT_FOO_VALUE = 'foo';
    act(() => {
      store.setState({
        foo: NEXT_FOO_VALUE,
      });
    });
    expect(foo).toBe(NEXT_FOO_VALUE);
  });

  function HookTester({ callback }) {
    callback();
    return null;
  }

  const hookTester = callback => {
    act(() => {
      render(<HookTester callback={callback} />);
    });
  };
});
