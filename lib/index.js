"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Freezer = require("freezer-js");
var StoreComponent = /** @class */ (function (_super) {
    __extends(StoreComponent, _super);
    function StoreComponent(stores) {
        var _this = _super.call(this) || this;
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
    function Store(state, options) {
        var _this = this;
        this.components = [];
        this.eventManager = null;
        this.frozenState = null;
        this.initialState = null;
        var opts = {
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
        this.frozenState.on('update', function (currentState, prevState) {
            _this.update(currentState, prevState);
        });
    }
    Object.defineProperty(Store.prototype, "state", {
        get: function () {
            return this.frozenState.get();
        },
        enumerable: true,
        configurable: true
    });
    Store.prototype.mergeStates = function (state1, state2) {
        return __assign({}, state1, state2);
    };
    Store.prototype.setState = function (newState) {
        var update = false;
        for (var prop in newState) {
            if (newState.hasOwnProperty(prop) && new Freezer(newState).get(prop) !== this.frozenState.get(prop)) {
                update = true;
            }
        }
        if (update) {
            this.frozenState.get().set(newState);
        }
    };
    Store.prototype.resetState = function () {
        this.frozenState.get().set(this.initialState.get());
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
        return this.initialState.get();
    };
    Store.prototype.on = function (eventType, callback) {
        var eventTypes = eventType && eventType.constructor === Array ? eventType : [eventType];
        var event = this.eventManager.add(eventTypes, callback);
        this.eventManager.fire('init', this.frozenState.get(), this.frozenState.get());
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
                if (followStates && followStates.length > 0) {
                    var update = false;
                    for (var _i = 0, followStates_1 = followStates; _i < followStates_1.length; _i++) {
                        var prop = followStates_1[_i];
                        if (storeState.hasOwnProperty(prop) && new Freezer(storeState).get(prop) !== new Freezer(prevState).get(prop)) {
                            update = true;
                        }
                    }
                    if (update) {
                        _this.forceUpdate();
                    }
                }
                else {
                    _this.forceUpdate();
                }
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
