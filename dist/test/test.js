"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect = require("expect");
const expect_jsx_1 = require("expect-jsx");
const store_1 = require("../demo/src/store");
const actions_1 = require("../demo/src/actions");
expect.extend(expect_jsx_1.default);
describe('testStoreState', () => {
    it('counter should be 4', (done) => {
        store_1.CommonStore.store.resetState();
        for (let i = 0; i < 4; i++) {
            actions_1.CommonActions.increaseCounter();
        }
        expect(store_1.CommonStore.store.state.counter).toEqual(4);
        done();
    });
    it('foo should be bar', (done) => {
        store_1.CommonStore.store.resetState();
        actions_1.CommonActions.toggleFooBar();
        expect(store_1.CommonStore.store.state.foo).toEqual('bar');
        done();
    });
    it('foo should be resetted to foo', (done) => {
        store_1.CommonStore.store.resetState();
        actions_1.CommonActions.toggleFooBar();
        store_1.CommonStore.store.resetState();
        expect(store_1.CommonStore.store.state.foo).toEqual('foo');
        done();
    });
    it('counter should be resetted to 0', (done) => {
        store_1.CommonStore.store.resetState();
        for (let i = 0; i < 4; i++) {
            actions_1.CommonActions.increaseCounter();
        }
        store_1.CommonStore.store.resetState();
        expect(store_1.CommonStore.store.state.counter).toEqual(0);
        done();
    });
    it('bar should be setted to 100', (done) => {
        store_1.CommonStore.store.resetState();
        actions_1.CommonActions.setSettings(100, 200);
        expect(store_1.CommonStore.store.state.settings.foo.bar).toEqual(100);
        done();
    });
    it('baz should be setted to 200', (done) => {
        store_1.CommonStore.store.resetState();
        actions_1.CommonActions.setSettings(100, 200);
        expect(store_1.CommonStore.store.state.settings.baz).toEqual(200);
        done();
    });
    it('bar should be resetted to 1', (done) => {
        store_1.CommonStore.store.resetState();
        actions_1.CommonActions.setSettings(100, 200);
        store_1.CommonStore.store.resetState();
        expect(store_1.CommonStore.store.state.settings.foo.bar).toEqual(1);
        done();
    });
    it('nullObj should be null', (done) => {
        store_1.CommonStore.store.resetState();
        actions_1.CommonActions.setNull(null);
        expect(store_1.CommonStore.store.state.nullObj).toEqual(null);
        done();
    });
    it('store init test', (done) => {
        store_1.CommonStore.store.resetState();
        const result = JSON.stringify(store_1.CommonStore.store.state);
        const etalon = JSON.stringify(store_1.CommonStore.initialState);
        expect(result).toEqual(etalon);
        done();
    });
    it('update numeric collection', (done) => {
        store_1.CommonStore.store.resetState();
        const newNumericArray = [3, 2];
        store_1.CommonStore.store.setState({
            numericArray: newNumericArray
        });
        const result = JSON.stringify(store_1.CommonStore.store.state.numericArray);
        const etalon = JSON.stringify(newNumericArray);
        expect(result).toEqual(etalon);
        done();
    });
    it('update objects collection', (done) => {
        store_1.CommonStore.store.resetState();
        const newObjectsArray = [{
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
        store_1.CommonStore.store.setState({
            objectsArray: newObjectsArray
        });
        const result = JSON.stringify(store_1.CommonStore.store.state.objectsArray);
        const etalon = JSON.stringify(newObjectsArray);
        expect(result).toEqual(etalon);
        done();
    });
    it('mutable test', (done) => {
        store_1.CommonStore.store.resetState();
        let objectsArrayFromStore = store_1.CommonStore.store.state.objectsArray;
        objectsArrayFromStore = [{
                id: 0,
                foo: 1,
                bar: {
                    baz: 123
                }
            }, [], [], [], {
                id: 1
            }];
        const result = JSON.stringify(store_1.CommonStore.store.state.objectsArray);
        const etalon = JSON.stringify(store_1.CommonStore.store.getInitialState().objectsArray);
        expect(result).toEqual(etalon);
        done();
    });
    it('deep array object', (done) => {
        store_1.CommonStore.store.resetState();
        const objectsArray = store_1.CommonStore.store.state.objectsArray.concat();
        objectsArray[1] = [];
        store_1.CommonStore.store.setState({
            objectsArray: objectsArray
        });
        const result = JSON.stringify([]);
        const etalon = JSON.stringify(store_1.CommonStore.store.state.objectsArray[1]);
        expect(result).toEqual(etalon);
        done();
    });
    it('event driven', (done) => {
        store_1.CommonStore.store.resetState();
        let counter = null;
        const event = store_1.CommonStore.store.on('update', (storeState, prevState, type) => {
            counter = storeState.counter.toString();
        });
        for (let i = 0; i < 4; i++) {
            actions_1.CommonActions.increaseCounter();
        }
        event.remove();
        expect(counter).toEqual('4');
        done();
    });
    it('store state replace', (done) => {
        store_1.CommonStore.store.resetState();
        for (let i = 0; i < 4; i++) {
            actions_1.CommonActions.increaseCounter();
        }
        actions_1.CommonActions.setSettings(100, 200);
        actions_1.CommonActions.toggleFooBar();
        const result = JSON.stringify(store_1.CommonStore.store.state);
        const etalon = JSON.stringify({
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
                    },
                    d: [
                        { id: 1, name: 'test 1', enabled: true },
                        { id: 2, name: 'test 2', enabled: false }
                    ]
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
    it('store state reset', (done) => {
        store_1.CommonStore.store.setState({
            foo: 'asdasd',
            counter: 12123123,
        });
        store_1.CommonStore.store.resetState();
        const result = JSON.stringify(store_1.CommonStore.store.state);
        const etalon = JSON.stringify({
            nullObj: null,
            counter: 0,
            foo: 'foo',
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
                    },
                    d: [
                        { id: 1, name: 'test 1', enabled: true },
                        { id: 2, name: 'test 2', enabled: false }
                    ]
                }],
            settings: {
                foo: {
                    bar: 1
                },
                baz: 2
            }
        });
        expect(result).toEqual(etalon);
        done();
    });
    it('update trigger', (done) => {
        store_1.CommonStore.store.resetState();
        let updated = 'false';
        store_1.CommonStore.store.on('update', (storeState) => {
            updated = 'true';
        });
        store_1.CommonStore.store.setState({
            counter: 0
        });
        expect(updated).toEqual('false');
        done();
    });
    it('previous state', (done) => {
        store_1.CommonStore.store.resetState();
        let prev = '0';
        const event = store_1.CommonStore.store.on('update', (storeState, prevState, type) => {
            prev = prevState.counter.toString();
        });
        store_1.CommonStore.store.setState({
            counter: 5,
        });
        expect(prev).toEqual('0');
        done();
    });
    it('update event trigger', (done) => {
        store_1.CommonStore.store.resetState();
        let eventType = null;
        const event = store_1.CommonStore.store.on('update', (storeState, prevState, type) => {
            eventType = type;
        });
        store_1.CommonStore.store.setState({
            counter: 100,
        });
        expect(eventType).toEqual('update');
        done();
    });
    it('init event trigger', (done) => {
        store_1.CommonStore.store.resetState();
        let eventType = null;
        const event = store_1.CommonStore.store.on('init', (storeState, prevState, type) => {
            eventType = type;
        });
        expect(eventType).toEqual('init');
        done();
    });
    it('all event trigger', (done) => {
        store_1.CommonStore.store.resetState();
        let eventCount = 0;
        const event = store_1.CommonStore.store.on('all', (storeState, prevState, type) => {
            eventCount++;
        });
        store_1.CommonStore.store.setState({
            counter: 100,
        });
        expect(eventCount).toEqual(2);
        done();
    });
    it('unnecessary updates', (done) => {
        store_1.CommonStore.store.resetState();
        let eventCount = 0;
        const event = store_1.CommonStore.store.on('all', (storeState, prevState, type) => {
            eventCount++;
        });
        store_1.CommonStore.store.setState({
            counter: 0,
        });
        store_1.CommonStore.store.setState({
            counter: 0,
        });
        store_1.CommonStore.store.setState({
            counter: 0,
        });
        expect(eventCount).toEqual(1);
        done();
    });
    it('bulk update', (done) => {
        store_1.CommonStore.store.resetState();
        let eventCount = 0;
        const event = store_1.CommonStore.store.on('update', (storeState, prevState, type) => {
            eventCount++;
        });
        store_1.CommonStore.store.setState({
            nullObj: null,
            counter: 3,
            foo: 'foo',
            numericArray: [1, 2, 3,],
            objectsArray: [{
                    a: 1,
                    b: 2,
                    c: 3
                }],
        });
        const c = store_1.CommonStore.store.state.counter;
        expect(eventCount).toEqual(1);
        done();
    });
});
//# sourceMappingURL=test.js.map