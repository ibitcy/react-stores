import { StoreEventType, StoreEvent } from '../src/store';
import * as expect from 'expect';
import expectJsx from 'expect-jsx';
import { CommonStore } from '../demo/src/store';
import { CommonActions } from '../demo/src/actions';

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

    it('deep array object', (done) => {
        CommonStore.store.resetState();

        const objectsArray: Object[] = CommonStore.store.state.objectsArray.concat();

        objectsArray[1] = [];

        CommonStore.store.setState({
            objectsArray: objectsArray
        } as CommonStore.State);

        const result: string = JSON.stringify([]);
        const etalon: string = JSON.stringify(CommonStore.store.state.objectsArray[1]);

        expect(result).toEqual(etalon);
        done();
    });

    it('event driven', (done) => {
        CommonStore.store.resetState();

        let counter: string = null;

        const event: StoreEvent<CommonStore.State> = CommonStore.store.on('update', (storeState: CommonStore.State, prevState: CommonStore.State, type: StoreEventType) => {
            counter = storeState.counter.toString();
        });

        for (let i = 0; i < 4; i++) {
            CommonActions.increaseCounter();
        }

        event.remove();

        expect(counter).toEqual('4');

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
                },
                d: [
                    {id: 1, name: 'test 1', enabled: true},
                    {id: 2, name: 'test 2', enabled: false}
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
        CommonStore.store.setState({
            foo: 'asdasd',
            counter: 12123123,
        });

        CommonStore.store.resetState();
        
        const result: string = JSON.stringify(CommonStore.store.state);
        const etalon: string = JSON.stringify({
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
                    {id: 1, name: 'test 1', enabled: true},
                    {id: 2, name: 'test 2', enabled: false}
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
        CommonStore.store.resetState();

        let updated: string = 'false';

        CommonStore.store.on('update', (storeState: CommonStore.State) => {
            updated = 'true';
        });

        CommonStore.store.setState({
            counter: 0
        } as CommonStore.State);
        
        expect(updated).toEqual('false');
        done();
    });

    it('previous state', (done) => {
        CommonStore.store.resetState();

        let prev = '0';

        const event: StoreEvent<CommonStore.State> = CommonStore.store.on('update', (storeState: CommonStore.State, prevState: CommonStore.State, type: StoreEventType) => {
            prev = prevState.counter.toString();
        });

        CommonStore.store.setState({
            counter: 5,
        });
        
        expect(prev).toEqual('0');
        done();
    });

    it('update event trigger', (done) => {
        CommonStore.store.resetState();

        let eventType = null;

        const event: StoreEvent<CommonStore.State> = CommonStore.store.on('update', (storeState: CommonStore.State, prevState: CommonStore.State, type: StoreEventType) => {
            eventType = type;
        });

        CommonStore.store.setState({
            counter: 100,
        });
        
        expect(eventType).toEqual('update');
        done();
    });

    it('init event trigger', (done) => {
        CommonStore.store.resetState();

        let eventType = null;

        const event: StoreEvent<CommonStore.State> = CommonStore.store.on('init', (storeState: CommonStore.State, prevState: CommonStore.State, type: StoreEventType) => {
            eventType = type;
        });

        expect(eventType).toEqual('init');
        done();
    });

    it('all event trigger', (done) => {
        CommonStore.store.resetState();

        let eventCount = 0;

        const event: StoreEvent<CommonStore.State> = CommonStore.store.on('all', (storeState: CommonStore.State, prevState: CommonStore.State, type: StoreEventType) => {
            eventCount++;
        });

        CommonStore.store.setState({
            counter: 100,
        });
        
        expect(eventCount).toEqual(2);
        done();
    });

    it('unnecessary updates', (done) => {
        CommonStore.store.resetState();

        let eventCount = 0;

        const event: StoreEvent<CommonStore.State> = CommonStore.store.on('all', (storeState: CommonStore.State, prevState: CommonStore.State, type: StoreEventType) => {
            eventCount++;
        });

        CommonStore.store.setState({
            counter: 0,
        });

        CommonStore.store.setState({
            counter: 0,
        });

        CommonStore.store.setState({
            counter: 0,
        });
        
        expect(eventCount).toEqual(1);
        done();
    });

    it('bulk update', (done) => {
        CommonStore.store.resetState();

        let eventCount = 0;

        const event: StoreEvent<CommonStore.State> = CommonStore.store.on('update', (storeState: CommonStore.State, prevState: CommonStore.State, type: StoreEventType) => {
            eventCount++;
        });

        CommonStore.store.setState({
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

        const c = CommonStore.store.state.counter
        
        expect(eventCount).toEqual(1);
        done();
    });
});
