const ReactStores = require('./lib/index');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

let initialState = {
    counter: 0,
    foo: 'xxx'
}

let store = new ReactStores.Store(initialState);
let component = ReactStores.StoreComponent;

component.prototype.render = () => {
    console.log()
    return React.createElement('div', null, null);
};

console.log(ReactDOMServer.renderToString(React.createElement(new component(), {
    store: store
})))