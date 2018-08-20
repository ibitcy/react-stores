"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Freezer = require("freezer-js");
var StorePersistantDriver = /** @class */ (function () {
    function StorePersistantDriver(name, lifetime) {
        if (lifetime === void 0) { lifetime = Infinity; }
        this.name = name;
        this.lifetime = lifetime;
        this.initialState = null;
    }
    StorePersistantDriver.prototype.pack = function (data) {
        return {
            data: data,
            timestamp: Date.now(),
        };
    };
    StorePersistantDriver.prototype.reset = function () {
        var pack = this.pack(this.initialState);
        this.write(pack);
        return pack;
    };
    Object.defineProperty(StorePersistantDriver.prototype, "storeName", {
        get: function () {
            return ("store.persistent." + this.type + "." + this.name).toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorePersistantDriver.prototype, "dumpHystoryName", {
        get: function () {
            return ("store.persistent.dump.history." + this.type + "." + this.name).toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    return StorePersistantDriver;
}());
exports.StorePersistantDriver = StorePersistantDriver;
var StorePersistentLocalSrorageDriver = /** @class */ (function (_super) {
    __extends(StorePersistentLocalSrorageDriver, _super);
    function StorePersistentLocalSrorageDriver(name, lifetime) {
        if (lifetime === void 0) { lifetime = Infinity; }
        var _this = _super.call(this, name, lifetime) || this;
        _this.name = name;
        _this.lifetime = lifetime;
        _this.storage = null;
        _this.type = 'localStorage';
        if (typeof window !== 'undefined' && window.localStorage) {
            _this.storage = window.localStorage;
        }
        return _this;
    }
    StorePersistentLocalSrorageDriver.prototype.write = function (pack) {
        if (this.storage) {
            try {
                this.storage.setItem(this.storeName, JSON.stringify(pack));
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    StorePersistentLocalSrorageDriver.prototype.read = function () {
        if (this.storage) {
            var dump = null;
            try {
                dump = JSON.parse(this.storage.getItem(this.storeName));
                if (!Boolean(dump) && !Boolean(dump.timestamp)) {
                    dump = this.reset();
                }
            }
            catch (e) {
                dump = this.reset();
            }
            return dump;
        }
        else {
            return this.reset();
        }
    };
    StorePersistentLocalSrorageDriver.prototype.saveDump = function (pack) {
        var timestamp = pack.timestamp;
        if (this.storage) {
            try {
                var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHystoryName));
                if (dumpHistory && dumpHistory.dumpHistory) {
                    dumpHistory.dumpHistory.push(pack);
                    this.storage.setItem(this.dumpHystoryName, JSON.stringify(dumpHistory));
                }
                else {
                    this.storage.setItem(this.dumpHystoryName, JSON.stringify({
                        dumpHistory: [pack],
                    }));
                }
            }
            catch (e) {
                try {
                    this.storage.setItem(this.dumpHystoryName, JSON.stringify({
                        dumpHistory: [pack],
                    }));
                }
                catch (e) {
                    console.error(e);
                    timestamp = null;
                }
                console.error(e);
                timestamp = null;
            }
        }
        return timestamp;
    };
    StorePersistentLocalSrorageDriver.prototype.removeDump = function (timestamp) {
        if (this.storage) {
            try {
                var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHystoryName));
                if (dumpHistory && dumpHistory.dumpHistory) {
                    var newDumpHistory = dumpHistory.dumpHistory.filter(function (dump) { return dump.timestamp !== timestamp; });
                    this.storage.setItem(this.dumpHystoryName, JSON.stringify({
                        dumpHistory: newDumpHistory,
                    }));
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    StorePersistentLocalSrorageDriver.prototype.readDump = function (timestamp) {
        var dump = null;
        try {
            var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHystoryName));
            if (dumpHistory && dumpHistory.dumpHistory) {
                dump = dumpHistory.dumpHistory.find(function (pack) { return pack.timestamp === timestamp; });
            }
            else {
                dump = null;
            }
        }
        catch (e) {
            console.error(e);
        }
        return dump;
    };
    StorePersistentLocalSrorageDriver.prototype.getDumpHistory = function () {
        var history = [];
        if (this.storage) {
            try {
                var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHystoryName));
                history = dumpHistory.dumpHistory.map(function (pack) { return pack.timestamp; });
            }
            catch (e) {
                console.error(e);
                history = [];
            }
        }
        return history;
    };
    StorePersistentLocalSrorageDriver.prototype.resetHistory = function () {
        if (this.storage) {
            try {
                this.storage.setItem(this.dumpHystoryName, JSON.stringify({
                    dumpHistory: [],
                }));
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    return StorePersistentLocalSrorageDriver;
}(StorePersistantDriver));
exports.StorePersistentLocalSrorageDriver = StorePersistentLocalSrorageDriver;
var StoreComponent = /** @class */ (function (_super) {
    __extends(StoreComponent, _super);
    function StoreComponent(props, stores) {
        var _this = _super.call(this, props) || this;
        _this.stores = {};
        _this.isStoreMounted = false;
        _this.stores = stores;
        for (var storeObject in _this.stores) {
            if (_this.stores.hasOwnProperty(storeObject)) {
                var store = _this.stores[storeObject];
                store.components.push(_this);
            }
        }
        return _this;
    }
    StoreComponent.prototype.storeComponentDidMount = function () {
    };
    StoreComponent.prototype.storeComponentWillUnmount = function () {
    };
    StoreComponent.prototype.storeComponentWillReceiveProps = function (nextProps) {
    };
    StoreComponent.prototype.storeComponentWillUpdate = function (nextProps, nextState) {
    };
    StoreComponent.prototype.storeComponentDidUpdate = function (prevProps, prevState) {
    };
    StoreComponent.prototype.shouldStoreComponentUpdate = function (nextProps, nextState) {
        return true;
    };
    StoreComponent.prototype.storeComponentStoreWillUpdate = function () {
    };
    StoreComponent.prototype.storeComponentStoreDidUpdate = function () {
    };
    StoreComponent.prototype.componentDidMount = function () {
        this.isStoreMounted = true;
        this.storeComponentDidMount();
    };
    StoreComponent.prototype.componentWillUnmount = function () {
        var _this = this;
        if (this.stores) {
            var _loop_1 = function (storeObject) {
                if (this_1.stores.hasOwnProperty(storeObject)) {
                    var store = this_1.stores[storeObject];
                    var newComponents_1 = [];
                    store.components.forEach(function (component) {
                        if (component !== _this) {
                            newComponents_1.push(component);
                        }
                    });
                    store.components = newComponents_1;
                }
            };
            var this_1 = this;
            for (var storeObject in this.stores) {
                _loop_1(storeObject);
            }
        }
        this.stores = null;
        this.isStoreMounted = false;
        this.storeComponentWillUnmount();
    };
    StoreComponent.prototype.componentWillReceiveProps = function (nextProps) {
        this.storeComponentWillReceiveProps(nextProps);
    };
    StoreComponent.prototype.componentWillUpdate = function (nextProps, nextState) {
        this.storeComponentWillUpdate(nextProps, nextState);
    };
    StoreComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
        this.storeComponentDidUpdate(prevProps, prevState);
    };
    StoreComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.shouldStoreComponentUpdate(nextProps, nextState);
    };
    return StoreComponent;
}(React.Component));
exports.StoreComponent = StoreComponent;
var Store = /** @class */ (function () {
    function Store(initialState, options, persistenceDriver) {
        var _this = this;
        this.persistenceDriver = persistenceDriver;
        this.components = [];
        this.eventManager = null;
        this.frozenState = null;
        this.initialState = null;
        this.opts = {
            live: false,
            freezeInstances: false,
            mutable: false,
        };
        var currentState = null;
        if (options) {
            this.opts.live = options.live === true;
            this.opts.freezeInstances = options.freezeInstances === true;
            this.opts.mutable = options.mutable === true;
            this.opts['singleParent'] = true;
        }
        if (this.persistenceDriver) {
            this.persistenceDriver.initialState = initialState;
            var persistantState = this.persistenceDriver.read().data;
            if (persistantState) {
                currentState = persistantState;
            }
        }
        if (currentState === null) {
            currentState = initialState;
        }
        this.eventManager = new StoreEventManager();
        this.initialState = new Freezer({ state: initialState });
        this.frozenState = new Freezer({ state: currentState }, this.opts);
        this.frozenState.on('update', function (currentState, prevState) {
            _this.update(currentState.state, prevState.state);
            if (_this.persistenceDriver) {
                _this.persistenceDriver.write(_this.persistenceDriver.pack(currentState.state));
            }
        });
    }
    Object.defineProperty(Store.prototype, "state", {
        get: function () {
            return this.frozenState.get().state;
        },
        enumerable: true,
        configurable: true
    });
    Store.prototype.resetPersistence = function () {
        if (this.persistenceDriver) {
            this.persistenceDriver.reset();
        }
    };
    Store.prototype.resetDumpHistory = function () {
        if (this.persistenceDriver) {
            this.persistenceDriver.resetHistory();
            this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
        }
    };
    Store.prototype.saveDump = function () {
        if (this.persistenceDriver) {
            this.persistenceDriver.saveDump(this.persistenceDriver.pack(this.frozenState.get().state));
            this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
        }
    };
    Store.prototype.removeDump = function (timestamp) {
        if (this.persistenceDriver) {
            this.persistenceDriver.removeDump(timestamp);
            this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
        }
    };
    Store.prototype.restoreDump = function (timestamp) {
        if (this.persistenceDriver) {
            var pack = this.persistenceDriver.readDump(timestamp);
            if (pack) {
                this.setState(pack.data);
                this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
            }
        }
    };
    Store.prototype.getDumpHistory = function () {
        if (this.persistenceDriver) {
            return this.persistenceDriver.getDumpHistory();
        }
    };
    Store.prototype.setState = function (newState) {
        var newFrozenState = new Freezer(newState);
        for (var prop in newState) {
            var newFrozenProp = newFrozenState.get()[prop];
            if (newFrozenProp !== this.frozenState.get().state[prop]) {
                this.frozenState.get().state.set(prop, newFrozenProp);
            }
        }
    };
    Store.prototype.resetState = function () {
        this.setState(this.initialState.get().state);
    };
    Store.prototype.update = function (currentState, prevState) {
        this.components.forEach(function (component) {
            if (component.isStoreMounted) {
                component.storeComponentStoreWillUpdate();
                component.forceUpdate();
                component.storeComponentStoreDidUpdate();
            }
        });
        this.eventManager.fire('update', currentState, prevState);
    };
    Store.prototype.getInitialState = function () {
        return this.initialState.get().state;
    };
    Store.prototype.on = function (eventType, callback) {
        var eventTypes = eventType && eventType.constructor === Array ? eventType : [eventType];
        var event = this.eventManager.add(eventTypes, callback);
        this.eventManager.fire('init', this.frozenState.get().state, this.frozenState.get().state);
        this.eventManager.fire('dumpUpdate', this.frozenState.get().state, this.frozenState.get().state);
        return event;
    };
    return Store;
}());
exports.Store = Store;
var StoreEvent = /** @class */ (function () {
    function StoreEvent(id, types, onFire, onRemove) {
        this.id = id;
        this.types = types;
        this.onFire = onFire;
        this.onRemove = onRemove;
    }
    StoreEvent.prototype.remove = function () {
        this.onRemove(this.id);
    };
    return StoreEvent;
}());
exports.StoreEvent = StoreEvent;
var StoreEventManager = /** @class */ (function () {
    function StoreEventManager() {
        this.events = [];
        this.eventCounter = 0;
    }
    StoreEventManager.prototype.generateEventId = function () {
        return "" + ++this.eventCounter + Date.now() + Math.random();
    };
    StoreEventManager.prototype.fire = function (type, storeState, prevState) {
        this.events.forEach(function (event) {
            if (event.types.indexOf(type) >= 0 || event.types.indexOf('all') >= 0) {
                event.onFire(storeState, prevState, type);
            }
        });
    };
    StoreEventManager.prototype.remove = function (id) {
        this.events = this.events.filter(function (event) {
            return event.id !== id;
        });
    };
    StoreEventManager.prototype.add = function (eventTypes, callback) {
        var _this = this;
        var event = new StoreEvent(this.generateEventId(), eventTypes, callback, function (id) {
            _this.remove(id);
        });
        this.events.push(event);
        return event;
    };
    return StoreEventManager;
}());
exports.followStore = function (store, followStates) { return function (WrappedComponent) {
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        function Component() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.storeEvent = null;
            _this.state = {
                storeState: null,
            };
            return _this;
        }
        Component.prototype.componentWillMount = function () {
            var _this = this;
            this.storeEvent = store.on('all', function (storeState, prevState, type) {
                _this.forceUpdate();
            });
        };
        Component.prototype.componentWillUnmount = function () {
            this.storeEvent.remove();
        };
        Component.prototype.render = function () {
            return React.createElement(WrappedComponent, this.props);
        };
        return Component;
    }(React.Component));
    return Component;
}; };
