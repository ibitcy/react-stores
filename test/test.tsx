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

    it('component rendering', () => {
        let renderer = ReactTestUtils.createRenderer();

		let testComponent = (
            <Test />
        );

        renderer.render(testComponent);

        expect(renderer.getRenderOutput())
			.toIncludeJSX(
                <div>
                    <h2>Test component</h2>
                    <p>Local state counter: 0</p>
                    <p>Shared state counter: 4</p>
                    <button onClick={function noRefCheck() {}}>Local +1</button>
                    <button onClick={function noRefCheck() {}}>Shred +1</button>
                    <button onClick={function noRefCheck() {}}>bar toggle</button>
                </div>
            )
	});
});