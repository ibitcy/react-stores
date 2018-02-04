import { Store, StoreComponent, StoreEventType } from '../src/store';
import * as ReactTestUtils from 'react-dom/test-utils';
import * as expect from 'expect';
import expectJsx from 'expect-jsx';
import * as React from 'react';
import { CommonStore } from '../demo/src/store';
import { CommonActions } from '../demo/src/actions';
import { Test } from '../demo/src/test';
import { Counter } from '../demo/src/counter';
import * as Mocha from 'mocha';

expect.extend(expectJsx);

describe('testStoreState', () => {
    it('counter should be 4', (done) => {
        CommonStore.store.resetState();

        for (let i = 0; i < 4; i++) {
            CommonActions.increaseCounter();
        }

        expect(CommonStore.store.state.counter).toEqual(4);
        done();
    });

    it('foo should be bar', (done) => {
        CommonStore.store.resetState();
        CommonActions.toggleFooBar();

        expect(CommonStore.store.state.foo).toEqual('bar');
        done();
    });

    it('foo should be resetted to foo', (done) => {
        CommonStore.store.resetState();
        CommonActions.toggleFooBar();
        CommonStore.store.resetState();

        expect(CommonStore.store.state.foo).toEqual('foo');
        done();
    });

    it('counter should be resetted to 0', (done) => {
        CommonStore.store.resetState();

        for (let i = 0; i < 4; i++) {
            CommonActions.increaseCounter();
        }

        CommonStore.store.resetState();

        expect(CommonStore.store.state.counter).toEqual(0);
        done();
    });

    it('bar should be setted to 100', (done) => {
        CommonStore.store.resetState();
        CommonActions.setSettings(100, 200);

        expect(CommonStore.store.state.settings.foo.bar).toEqual(100);
        done();
    });

    it('baz should be setted to 200', (done) => {
        CommonStore.store.resetState();
        CommonActions.setSettings(100, 200);

        expect(CommonStore.store.state.settings.baz).toEqual(200);
        done();
    });

    it('bar should be resetted to 1', (done) => {
        CommonStore.store.resetState();
        CommonActions.setSettings(100, 200);
        CommonStore.store.resetState();

        expect(CommonStore.store.state.settings.foo.bar).toEqual(1);
        done();
    });

    it('nullObj should be null', (done) => {
        CommonStore.store.resetState();
        CommonActions.setNull(null);

        expect(CommonStore.store.state.nullObj).toEqual(null);
        done();
    });

    it('store init test', (done) => {
        CommonStore.store.resetState();

        const result: string = JSON.stringify(CommonStore.store.state);
        const etalon: string = JSON.stringify(CommonStore.initialState);

        expect(result).toEqual(etalon);
        done();
    });

    it('update numeric collection', (done) => {
        CommonStore.store.resetState();

        const newNumericArray = [3, 2];

        CommonStore.store.setState({
            numericArray: newNumericArray
        } as CommonStore.State);

        const result: string = JSON.stringify(CommonStore.store.state.numericArray);
        const etalon: string = JSON.stringify(newNumericArray);

        expect(result).toEqual(etalon);
        done();
    });

    it('update objects collection', (done) => {
        CommonStore.store.resetState();

        const newObjectsArray: Object[] = [{
            x: 1,
            y: 2,
            z: 3
        },
        {
            x: 3,
            y: 2,
            z: {
                a: 1,
                b: [true, false, null]
            }
        }];

        CommonStore.store.setState({
            objectsArray: newObjectsArray
        } as CommonStore.State);

        const result: string = JSON.stringify(CommonStore.store.state.objectsArray);
        const etalon: string = JSON.stringify(newObjectsArray);

        expect(result).toEqual(etalon);
        done();
    });

    it('mutable test', (done) => {
        CommonStore.store.resetState();

        let objectsArrayFromStore: Object[] = CommonStore.store.state.objectsArray;

        objectsArrayFromStore = [{
            id: 0,
            foo: 1,
            bar: {
                baz: 123
            }
        }, [], [], [], {
            id: 1
        }];

        const result: string = JSON.stringify(CommonStore.store.state.objectsArray);
        const etalon: string = JSON.stringify(CommonStore.store.getInitialState().objectsArray);

        expect(result).toEqual(etalon);
        done();
    });

    it('event driven', (done) => {
        CommonStore.store.resetState();

        let counter: number = 0;

        CommonStore.store.on(StoreEventType.storeUpdated, (storeState: CommonStore.State) => {
            counter = storeState.counter;
        });

        for (let i = 0; i < 4; i++) {
            CommonActions.increaseCounter();
        }

        expect(counter).toEqual(4);
        done();
    });

    it('store state replace', (done) => {
        CommonStore.store.resetState();

        for (let i = 0; i < 4; i++) {
            CommonActions.increaseCounter();
        }

        CommonActions.setSettings(100, 200);
        CommonActions.toggleFooBar();

        const result: string = JSON.stringify(CommonStore.store.state);
        const etalon: string = JSON.stringify({
            nullObj: null,
            counter: 4,
            foo: 'bar',
            numericArray: [1, 2, 3],
            objectsArray: [{
                a: 1,
                b: 2,
                c: 3
            },
            {
                a: 3,
                b: 2,
                c: {
                    a: 1,
                    b: [1, 2, 3]
                }
            }],
            settings: {
                foo: {
                    bar: 100
                },
                baz: 200
            }
        });

        expect(result).toEqual(etalon);
        done();
    });
});
