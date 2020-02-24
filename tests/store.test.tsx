import expect from 'expect';
import expectJsx from 'expect-jsx';

import { StoreEventType } from '../lib';
import { Actions, initialState, storeImmutable, storeMutable, callTimes } from './utils';
import { Store } from '../src';

expect.extend(expectJsx);

describe('store', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('check store name', done => {
    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    expect(storeImmutable.name).toEqual('-1a3306b2');
    done();
  });

  it('store init correct', done => {
    const result: string = JSON.stringify(storeImmutable.state);
    const etalon: string = JSON.stringify(JSON.parse(initialState));

    expect(result).toEqual(etalon);
    done();
  });

  it('replace', done => {
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
          d: [
            { id: 1, name: 'test 1', enabled: true },
            { id: 2, name: 'test 2', enabled: false },
          ],
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

  it('reset', done => {
    storeImmutable.setState({
      foo: 'asdasd',
      counter: 12123123,
    });

    storeImmutable.resetState();

    const result: string = JSON.stringify(storeImmutable.state);
    const etalon: string = initialState;

    expect(result).toEqual(etalon);
    done();
  });

  it('throw error with incorrect types for initial state', done => {
    // const bigint = 2n ** 53n;
    const forbiddenTypes = [
      0,
      // bigint,
      true,
      'string',
      [],
      () => {},
      new Function(),
      new Map(),
      undefined,
      Symbol('string'),
      new Promise(() => {}),
    ];
    forbiddenTypes.forEach(type => {
      expect(() => {
        const state = new Store(type);
      }).toThrow();
    });

    done();
  });
});

describe('stored number value', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('correct set', done => {
    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    expect(storeImmutable.state.counter).toEqual(4);
    done();
  });

  it('correct reset', done => {
    for (let i = 0; i < 4; i++) {
      Actions.increaseCounter();
    }

    storeImmutable.resetState();

    expect(storeImmutable.state.counter).toEqual(0);
    done();
  });
});

describe('stored string value', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('correct set', done => {
    Actions.toggleFooBar();

    expect(storeImmutable.state.foo).toEqual('bar');
    done();
  });

  it('correct reset', done => {
    Actions.toggleFooBar();
    storeImmutable.resetState();

    expect(storeImmutable.state.foo).toEqual('foo');
    done();
  });
});

describe('stored object value', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('correct set', done => {
    Actions.setSettings(100, 200);

    expect(storeImmutable.state.settings.baz).toEqual(200);
    done();
  });

  it('correct depp set', done => {
    Actions.setSettings(100, 200);

    expect(storeImmutable.state.settings.foo.bar).toEqual(100);
    done();
  });

  it('correct reset', done => {
    Actions.setSettings(100, 200);
    storeImmutable.resetState();

    expect(storeImmutable.state.settings.foo.bar).toEqual(1);
    done();
  });
});

describe('stored collections', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('set numeric collection', done => {
    const newNumericArray = [3, 2];

    storeImmutable.setState({
      numericArray: newNumericArray,
    });

    const result: string = JSON.stringify(storeImmutable.state.numericArray);
    const etalon: string = JSON.stringify(newNumericArray);

    expect(result).toEqual(etalon);
    done();
  });

  it('set collection of objects', done => {
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

  it('set deep collection of object', done => {
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
});

describe('stored other types', () => {
  beforeEach(() => {
    storeImmutable.resetState();
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

  it('deep objects mutation', done => {
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
});

describe('store event', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('correct update flow', done => {
    const COUNT = 3;
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, eventListener);
    callTimes(Actions.increaseCounter, COUNT);
    event.remove();

    expect(eventListener.mock.calls.length).toEqual(COUNT);
    done();
  });

  it('update event triggered', done => {
    const eventListener = jest.fn();

    storeImmutable.on(StoreEventType.Update, eventListener);

    storeImmutable.setState({
      counter: 0,
    });

    expect(eventListener.mock.calls.length).toBeGreaterThan(0);
    done();
  });

  it('init event triggered', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Init, eventListener);

    event.remove();
    expect(eventListener.mock.calls[0][2]).toEqual(StoreEventType.Init);
    done();
  });

  it('all event triggered', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.All, eventListener);

    storeImmutable.setState({
      counter: 100,
    });

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(3);
    done();
  });

  it('correct previous state', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, eventListener);

    storeImmutable.setState({
      counter: 5,
    });

    event.remove();

    expect(eventListener.mock.calls[0][1].counter).toEqual(0);
    done();
  });

  it('update simple number value', done => {
    const COUNT = 3;
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, eventListener);

    callTimes(Actions.increaseCounter, COUNT);

    event.remove();

    expect(eventListener.mock.calls[COUNT - 1][0].counter).toEqual(COUNT);

    done();
  });

  it('bulk update count', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, eventListener);

    storeImmutable.setState({
      nullObj: null,
      counter: 0,
      foo: 'foo',
      numericArray: [1, 2, 3],
    });

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(1);
    done();
  });
});

describe('immutable store', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('correct', done => {
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

  it('objects direct assign throw', done => {
    expect(() => {
      storeImmutable.state.objectsArray = null;
    }).toThrow();

    done();
  });

  it('array direct assign throw', done => {
    expect(() => {
      storeImmutable.state.objectsArray = null;
    }).toThrow();

    done();
  });

  it('deep objects direct assign throw', done => {
    expect(() => {
      storeImmutable.state.objectsArray[0] = 123;
    }).toThrow();

    done();
  });

  it('deep objects instance mutations immutable', done => {
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
});

describe('mutable store', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('deep object direct assign mutable', done => {
    storeMutable.resetState();

    storeMutable.state.objectsArray[0] = 123456;

    expect(JSON.stringify(storeMutable.state.objectsArray[0])).toEqual('123456');

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
