import expect from 'expect';
import expectJsx from 'expect-jsx';

import { StoreEventType } from '../lib';
import { Actions, callTimes, storeImmutable } from './utils';

expect.extend(expectJsx);

describe('include keys: do not call event', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('change unwatcher neighbor string', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['counter'], eventListener);

    Actions.toggleFooBar();

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(0);
    done();
  });

  it('change unwatcher neighbor array', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['counter'], eventListener);

    storeImmutable.setState({
      numericArray: [3, 2],
    });
    event.remove();

    expect(eventListener.mock.calls.length).toEqual(0);
    done();
  });

  it('change unwatcher neighbor object', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['counter'], eventListener);

    const newObjArr = storeImmutable.state.objectsArray.concat();

    newObjArr[0] = {
      test: 1,
    };

    storeImmutable.setState({
      objectsArray: newObjArr,
    });

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(0);
    done();
  });

  it('change unwatcher neighbor number', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['objectsArray'], eventListener);

    Actions.increaseCounter();

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(0);
    done();
  });
});

describe('inсlude keys: call event', () => {
  beforeEach(() => {
    storeImmutable.resetState();
  });

  it('with type number', done => {
    const COUNT = 3;
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['counter'], eventListener);

    callTimes(Actions.increaseCounter, COUNT);

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(COUNT);
    done();
  });

  it('with type string', done => {
    const COUNT = 3;
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['foo'], eventListener);

    callTimes(Actions.toggleFooBar, COUNT);

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(COUNT);
    done();
  });

  it('with type array', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['numericArray'], eventListener);
    const newNumericArray = [3, 2];

    storeImmutable.setState({
      numericArray: newNumericArray,
    });

    event.remove();

    expect(eventListener.mock.calls[0][0].numericArray).toEqual(newNumericArray);
    done();
  });

  it('with deep object patch ', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['objectsArray'], eventListener);
    const newObjArr = storeImmutable.state.objectsArray.concat();

    newObjArr[0] = {
      test: 1,
    };

    storeImmutable.setState({
      objectsArray: newObjArr,
    });

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(1);
    done();
  });

  it('for each of watched keys', done => {
    const COUNT = 3;
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['counter', 'foo'], eventListener);
    callTimes(Actions.increaseCounter, COUNT);
    Actions.toggleFooBar();

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(COUNT + 1);
    done();
  });

  it('one of watched keys', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['counter', 'foo'], eventListener);

    Actions.toggleFooBar();

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(1);
    done();
  });

  it('both of watched keys', done => {
    const eventListener = jest.fn();

    const event = storeImmutable.on(StoreEventType.Update, ['counter', 'foo'], eventListener);

    storeImmutable.setState({
      counter: 15,
      foo: 'bar',
    });

    event.remove();

    expect(eventListener.mock.calls.length).toEqual(1);
    done();
  });

  it('correct state after update', done => {
    const eventListener = jest.fn();
    let nextState = {
      counter: 15,
      foo: 'bar',
      numericArray: [1],
    };

    const event = storeImmutable.on(StoreEventType.Update, ['counter', 'foo', 'numericArray'], eventListener);

    storeImmutable.setState(nextState);

    event.remove();

    expect(eventListener.mock.calls[0][0].counter).toEqual(nextState.counter);
    expect(eventListener.mock.calls[0][0].foo).toEqual(nextState.foo);
    expect(eventListener.mock.calls[0][0].numericArray).toEqual(nextState.numericArray);
    done();
  });
});
