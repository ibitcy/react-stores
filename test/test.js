const ReactStores = require('../index');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

let initialState = {
    counter: 0,
    foo: ''
}

let store = new ReactStores.Store(initialState);

describe('testStoreState', () => {
    it('counter should be 4', (done) => {
        for (let i = 0; i < 4; i++) {
            store.setState({
                counter: store.state.counter + 1
            });
        }

        store.state.counter
            .should
            .equal(4);
            
        done();
    });

    it('foo should be bar', (done) => {
        store.setState({
            foo: 'bar'
        });

        store.state.foo
            .should
            .equal('bar');
            
        done();
    });
});