"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Freezer = require("freezer-js");
class StoreComponent extends React.Component {
    constructor(stores) {
        super();
        this.stores = {};
        this.isStoreMounted = false;
        this.stores = stores;
        for (let storeObject in this.stores) {
            if (this.stores.hasOwnProperty(storeObject)) {
                let store = this.stores[storeObject];
                store.components.push(this);
            }
        }
    }
    storeComponentDidMount() {
    }
    storeComponentWillUnmount() {
    }
    storeComponentWillReceiveProps(nextProps) {
    }
    storeComponentWillUpdate(nextProps, nextState) {
    }
    storeComponentDidUpdate(prevProps, prevState) {
    }
    shouldStoreComponentUpdate(nextProps, nextState) {
        return true;
    }
    storeComponentStoreWillUpdate() {
    }
    storeComponentStoreDidUpdate() {
    }
    componentDidMount() {
        this.isStoreMounted = true;
        this.storeComponentDidMount();
    }
    componentWillUnmount() {
        if (this.stores) {
            for (let storeObject in this.stores) {
                if (this.stores.hasOwnProperty(storeObject)) {
                    const store = this.stores[storeObject];
                    const newComponents = [];
                    store.components.forEach((component) => {
                        if (component !== this) {
                            newComponents.push(component);
                        }
                    });
                    store.components = newComponents;
                }
            }
        }
        this.stores = null;
        this.isStoreMounted = false;
        this.storeComponentWillUnmount();
    }
    componentWillReceiveProps(nextProps) {
        this.storeComponentWillReceiveProps(nextProps);
    }
    componentWillUpdate(nextProps, nextState) {
        this.storeComponentWillUpdate(nextProps, nextState);
    }
    componentDidUpdate(prevProps, prevState) {
        this.storeComponentDidUpdate(prevProps, prevState);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.shouldStoreComponentUpdate(nextProps, nextState);
    }
}
exports.StoreComponent = StoreComponent;
class Store {
    constructor(state, options) {
        this.components = [];
        this.eventManager = null;
        this.frozenState = null;
        this.initialState = null;
        let opts = {
            live: false,
            freezeInstances: false,
            mutable: false,
        };
        if (options) {
            opts.live = options.live === true;
            opts.freezeInstances = options.freezeInstances === true;
            opts.mutable = options.mutable === true;
        }
        this.eventManager = new StoreEventManager();
        this.initialState = new Freezer(state);
        this.frozenState = new Freezer(state, opts);
        this.frozenState.on('update', (currentState, prevState) => {
            this.update(currentState, prevState);
        });
    }
    get state() {
        return this.frozenState.get();
    }
    mergeStates(state1, state2) {
        return Object.assign({}, state1, state2);
    }
    setState(newState) {
        let update = false;
        let updCo = 0;
        for (const prop in newState) {
            if (newState.hasOwnProperty(prop) && new Freezer(newState).get(prop) !== this.frozenState.get(prop)) {
                update = true;
                updCo++;
            }
        }
        console.log('updc', updCo);
        if (update) {
            this.frozenState.get().set(newState);
        }
    }
    resetState() {
        this.frozenState.get().set(this.initialState.get());
    }
    update(currentState, prevState) {
        this.components.forEach((component) => {
            if (component.isStoreMounted) {
                component.storeComponentStoreWillUpdate();
                component.forceUpdate();
                component.storeComponentStoreDidUpdate();
            }
        });
        this.eventManager.fire('update', currentState, prevState);
    }
    getInitialState() {
        return this.initialState.get();
    }
    on(eventType, callback) {
        const eventTypes = eventType && eventType.constructor === Array ? eventType : [eventType];
        const event = this.eventManager.add(eventTypes, callback);
        this.eventManager.fire('init', this.frozenState.get(), this.frozenState.get());
        return event;
    }
}
exports.Store = Store;
class StoreEvent {
    constructor(id, types, onFire, onRemove) {
        this.id = id;
        this.types = types;
        this.onFire = onFire;
        this.onRemove = onRemove;
    }
    remove() {
        this.onRemove(this.id);
    }
}
exports.StoreEvent = StoreEvent;
class StoreEventManager {
    constructor() {
        this.events = [];
        this.eventCounter = 0;
    }
    generateEventId() {
        return `${++this.eventCounter}${Date.now()}${Math.random()}`;
    }
    fire(type, storeState, prevState) {
        this.events.forEach((event) => {
            if (event.types.indexOf(type) >= 0 || event.types.indexOf('all') >= 0) {
                event.onFire(storeState, prevState, type);
            }
        });
    }
    remove(id) {
        this.events = this.events.filter((event) => {
            return event.id !== id;
        });
    }
    add(eventTypes, callback) {
        const event = new StoreEvent(this.generateEventId(), eventTypes, callback, (id) => {
            this.remove(id);
        });
        this.events.push(event);
        return event;
    }
}
exports.followStore = (store, followStates) => (WrappedComponent) => {
    class Component extends React.Component {
        constructor() {
            super(...arguments);
            this.storeEvent = null;
            this.state = {
                storeState: null,
            };
        }
        componentWillMount() {
            this.storeEvent = store.on('all', (storeState, prevState, type) => {
                if (followStates && followStates.length > 0) {
                    let update = false;
                    for (const prop of followStates) {
                        if (storeState.hasOwnProperty(prop) && new Freezer(storeState).get(prop) !== new Freezer(prevState).get(prop)) {
                            update = true;
                        }
                    }
                    if (update) {
                        this.forceUpdate();
                    }
                }
                else {
                    this.forceUpdate();
                }
            });
        }
        componentWillUnmount() {
            this.storeEvent.remove();
        }
        render() {
            return React.createElement(WrappedComponent, this.props);
        }
    }
    return Component;
};
//# sourceMappingURL=store.js.map