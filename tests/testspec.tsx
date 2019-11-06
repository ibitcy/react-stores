import expect from 'expect';
import expectJsx from 'expect-jsx';
import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { Store, StoreEventType, useStore } from '../src';

const initialState = `{"nullObj":null,"counter":0,"foo":"foo","numericArray":[1,2,3],"objectsArray":[{"a":1,"b":2,"c":3},{"a":3,"b":2,"c":{"a":1,"b":[1,2,3]},"d":[{"id":1,"name":"test 1","enabled":true},{"id":2,"name":"test 2","enabled":false}]}],"settings":{"foo":{"bar":1},"baz":2}}`;

const storeImmutable = new Store<StoreState>(JSON.parse(initialState), { immutable: true });
const storeMutable = new Store<StoreState>(JSON.parse(initialState), { immutable: false });

class Actions {
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
    storeImmutable.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    expect(storeImmutable.id).toEqual('-1a3306b2');
    done();
  });

  it('counter should be 4', done => {
    storeImmutable.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    expect(storeImmutable.state.counter).toEqual(4);
    done();
  });

  it('foo should be bar', done => {
    storeImmutable.resetState();
    Actions.toggleFooBar();

    expect(storeImmutable.state.foo).toEqual('bar');
    done();
  });

  it('foo should be resetted to foo', done => {
    storeImmutable.resetState();
    Actions.toggleFooBar();
    storeImmutable.resetState();

    expect(storeImmutable.state.foo).toEqual('foo');
    done();
  });

  it('counter should be resetted to 0', done => {
    storeImmutable.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    storeImmutable.resetState();

    expect(storeImmutable.state.counter).toEqual(0);
    done();
  });

  it('bar should be set to 100', done => {
    storeImmutable.resetState();
    Actions.setSettings(100, 200);

    expect(storeImmutable.state.settings.foo.bar).toEqual(100);
    done();
  });

  it('baz should be set to 200', done => {
    storeImmutable.resetState();
    Actions.setSettings(100, 200);

    expect(storeImmutable.state.settings.baz).toEqual(200);
    done();
  });

  it('bar should be reset to 1', done => {
    storeImmutable.resetState();
    Actions.setSettings(100, 200);
    storeImmutable.resetState();

    expect(storeImmutable.state.settings.foo.bar).toEqual(1);
    done();
  });

  it('nullObj should be null', done => {
    storeImmutable.setState({
      nullObj: undefined,
    });

    storeImmutable.resetState();
    Actions.setNull(null);

    expect(storeImmutable.state.nullObj).toEqual(null);
    done();
  });

  it('store init test', done => {
    storeImmutable.resetState();

    const result: string = JSON.stringify(storeImmutable.state);
    const etalon: string = JSON.stringify(JSON.parse(initialState));

    expect(result).toEqual(etalon);
    done();
  });

  it('update numeric collection', done => {
    storeImmutable.resetState();

    const newNumericArray = [3, 2];

    storeImmutable.setState({
      numericArray: newNumericArray,
    });

    const result: string = JSON.stringify(storeImmutable.state.numericArray);
    const etalon: string = JSON.stringify(newNumericArray);

    expect(result).toEqual(etalon);
    done();
  });

  it('update objects collection', done => {
    storeImmutable.resetState();

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

    storeImmutable.setState({
      objectsArray: newObjectsArray,
    });

    const result: string = JSON.stringify(storeImmutable.state.objectsArray);
    const etalon: string = JSON.stringify(newObjectsArray);

    expect(result).toEqual(etalon);
    done();
  });

  it('mutable test', done => {
    storeImmutable.resetState();

    let objectsArrayFromStore: Object[] = storeImmutable.state.objectsArray;

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

    const result: string = JSON.stringify(storeImmutable.state.objectsArray);
    const etalon: string = JSON.stringify(storeImmutable.getInitialState().objectsArray);

    expect(result).toEqual(etalon);
    done();
  });

  it('deep array object', done => {
    storeImmutable.resetState();

    const objectsArray: Object[] = storeImmutable.state.objectsArray.concat();

    objectsArray[1] = [];

    storeImmutable.setState({
      objectsArray,
    });

    const result: string = JSON.stringify([]);
    const etalon: string = JSON.stringify(storeImmutable.state.objectsArray[1]);

    expect(result).toEqual(etalon);
    done();
  });

  it('event driven', done => {
    storeImmutable.resetState();

    let counter: string = null;

    const event = storeImmutable.on(StoreEventType.Update, storeState => {
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
    storeImmutable.resetState();

    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    Actions.setSettings(100, 200);
    Actions.toggleFooBar();

    const result: string = JSON.stringify(storeImmutable.state);
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
    storeImmutable.setState({
      foo: 'asdasd',
      counter: 12123123,
    });

    storeImmutable.resetState();

    const result: string = JSON.stringify(storeImmutable.state);
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
    storeImmutable.resetState();

    let updated: string = 'false';

    storeImmutable.on(StoreEventType.Update, storeState => {
      updated = 'true';
    });

    storeImmutable.setState({
      counter: 0,
    });

    expect(updated).toEqual('true');
    done();
  });

  it('previous state', done => {
    storeImmutable.resetState();

    let prev = '0';

    const event = storeImmutable.on(StoreEventType.Update, (storeState, prevState, type) => {
      prev = prevState.counter.toString();
    });

    storeImmutable.setState({
      counter: 5,
    });

    event.remove();

    expect(prev).toEqual('0');
    done();
  });

  it('update event trigger', done => {
    storeImmutable.resetState();

    let eventType = null;

    const event = storeImmutable.on(StoreEventType.Update, (storeState, prevState, type) => {
      eventType = type;
    });

    storeImmutable.setState({
      counter: 100,
    });

    event.remove();

    expect(eventType).toEqual(StoreEventType.Update);
    done();
  });

  it('init event trigger', done => {
    storeImmutable.resetState();

    let eventType = null;

    const event = storeImmutable.on(StoreEventType.Init, (storeState, prevState, type) => {
      eventType = type;
    });

    event.remove();

    expect(eventType).toEqual(StoreEventType.Init);
    done();
  });

  it('all event trigger', done => {
    storeImmutable.resetState();

    let eventCount = 0;

    const event = storeImmutable.on(StoreEventType.All, (storeState, prevState, type) => {
      eventCount++;
    });

    storeImmutable.setState({
      counter: 100,
    });

    event.remove();

    expect(eventCount).toEqual(3);
    done();
  });

  it('update counter', done => {
    storeImmutable.resetState();

    let eventCount = 0;

    const event = storeImmutable.on(StoreEventType.Update, (storeState, prevState, type) => {
      if (type !== StoreEventType.DumpUpdate) {
        eventCount++;
      }
    });

    storeImmutable.setState({
      counter: 0,
    });

    storeImmutable.setState({
      counter: 0,
    });

    storeImmutable.setState({
      counter: 0,
    });

    event.remove();

    expect(eventCount).toEqual(3);
    done();
  });

  it('bulk update count', done => {
    storeImmutable.resetState();

    let eventCount = 0;

    const event = storeImmutable.on(StoreEventType.Update, () => {
      eventCount++;
    });

    storeImmutable.setState({
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
    storeImmutable.resetState();

    const newObjArr = storeImmutable.state.objectsArray.concat();

    newObjArr[0] = {
      test: 1,
    };

    storeImmutable.setState({
      objectsArray: newObjArr,
    });

    expect(JSON.stringify(storeImmutable.state.objectsArray[0])).toEqual('{"test":1}');
    done();
  });

  it('objects direct assign throw', done => {
    storeImmutable.resetState();

    expect(() => {
      storeImmutable.state.objectsArray = null;
    }).toThrow();

    done();
  });

  it('objects direct assign throw', done => {
    storeImmutable.resetState();

    expect(() => {
      storeImmutable.state.objectsArray = null;
    }).toThrow();

    done();
  });

  it('deep objects direct assign throw', done => {
    storeImmutable.resetState();

    expect(() => {
      storeImmutable.state.objectsArray[0] = 123;
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
    storeImmutable.resetState();

    const newObjArr1 = storeImmutable.state.objectsArray.concat();
    const TheClass = function(a) {
      this.a = a;
      this.setA = function(a) {
        this.a = a;
      };
    };

    newObjArr1[0] = new TheClass(1);
    storeImmutable.setState({
      objectsArray: newObjArr1,
    });
    expect(storeImmutable.state.objectsArray[0]['a']).toEqual(1);

    const newObjArr2 = storeImmutable.state.objectsArray.concat();

    expect(() => {
      newObjArr2[0]['a'] = 2;
    }).toThrow();

    storeImmutable.setState({
      objectsArray: newObjArr2,
    });
    expect(storeImmutable.state.objectsArray[0]['a']).toEqual(1);

    const newObjArr3 = storeImmutable.state.objectsArray.concat();

    expect(() => {
      newObjArr3[0]['setA'](3);
    });

    storeImmutable.setState({
      objectsArray: newObjArr3,
    });
    expect(storeImmutable.state.objectsArray[0]['a']).toEqual(1);

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
      storeImmutable.resetState();
    });
    cleanup();
  });

  it('Should render initial value', () => {
    let counter: number;
    hookTester(() => ({ counter } = useStore(storeImmutable)));

    expect(counter).toEqual(JSON.parse(initialState).counter);
  });

  it('Should change state after store update', () => {
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

  it('Should affect on right StoreEventType', () => {
    let counter: number;
    hookTester(
      () =>
        ({ counter } = useStore(storeImmutable, {
          eventType: StoreEventType.Init,
          mapState: storeState => storeState,
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

  it('Should map state', () => {
    let foo: string;
    hookTester(
      () =>
        ({ foo } = useStore<StoreState, { foo: string }>(storeImmutable, {
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
        ({ foo } = useStore<StoreState, { foo: string }>(storeImmutable, {
          mapState: storeState => {
            return {
              foo: storeState.foo,
            };
          },
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
