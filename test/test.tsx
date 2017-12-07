import {Store, StoreComponent} from '../src/store';
import * as ReactTestUtils from 'react-dom/test-utils';
import * as expect from 'expect';
import expectJsx from 'expect-jsx';
import * as React from 'react';
import {CommonStore} from '../demo/src/store';
import {CommonActions} from '../demo/src/actions';
import {Test} from '../demo/src/test';
import {Counter} from '../demo/src/counter';
import * as Mocha from 'mocha';

expect.extend(expectJsx);

describe('testStoreState', () => {
    it('counter should be 4', (done) => {
        for (let i = 0; i < 4; i++) {
            CommonActions.increaseCounter();
        }

        expect(CommonStore.store.state.counter).toEqual(4);
        done();
    });

    it('foo should be bar', (done) => {
        CommonActions.toggleFooBar();

        expect(CommonStore.store.state.foo).toEqual('bar');
        done();
    });

    it('foo should be reseted to foo', (done) => {
        CommonActions.toggleFooBar();
        CommonActions.reset();

        expect(CommonStore.store.state.foo).toEqual('foo');
        done();
    });

    it('counter should be reseted to 0', (done) => {
        for (let i = 0; i < 4; i++) {
            CommonActions.increaseCounter();
        }

        CommonActions.reset();

        expect(CommonStore.store.state.counter).toEqual(0);
        done();
    });

    it('bar should be setted to 100', (done) => {
        CommonActions.setSettings(100, 200);

        expect(CommonStore.store.state.settings.foo.bar).toEqual(100);
        done();
    });

    it('baz should be setted to 200', (done) => {
        CommonActions.setSettings(100, 200);

        expect(CommonStore.store.state.settings.baz).toEqual(200);
        done();
    });

    it('bar should be reseted to 1', (done) => {
        CommonActions.setSettings(100, 200);
        CommonStore.store.resetState();

        expect(CommonStore.store.state.settings.foo.bar).toEqual(1);
        done();
    });

    it('nullObj should be null', (done) => {
        CommonActions.setNull(null);

        expect(CommonStore.store.state.nullObj).toEqual(null);
        done();
    });
});