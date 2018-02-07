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
exports.__esModule = true;
var React = require("react");
var Immutable = require("immutable");
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
    function Store(state) {
        this.components = [];
        this.state = null;
        this.stateImmutable = null;
        this.initialStateImmutable = null;
        this.eventManager = null;
        this.eventManager = new StoreEventManager();
        this.stateImmutable = Immutable.Map(Immutable.fromJS(state));
        this.initialStateImmutable = Immutable.Map(state);
        this.state = this.stateImmutable.toJS();
    }
    Store.prototype.setState = function (newState) {
        var current = this.state;
        var merged = __assign({}, current, newState);
        if (JSON.stringify(current) !== JSON.stringify(merged)) {
            this.stateImmutable = this.stateImmutable.mergeDeep(Immutable.fromJS(newState));
            this.state = this.stateImmutable.toJS();
            this.update();
        }
    };
    Store.prototype.resetState = function () {
        this.stateImmutable = Immutable.Map(this.initialStateImmutable.toJS());
        this.state = this.initialStateImmutable.toJS();
        this.update();
    };
    Store.prototype.update = function () {
        this.components.forEach(function (component) {
            if (component.isStoreMounted) {
                component.storeComponentStoreWillUpdate();
                component.forceUpdate();
                component.storeComponentStoreDidUpdate();
            }
        });
        this.eventManager.fire(StoreEventType.update, this.stateImmutable.toJS());
    };
    Store.prototype.getInitialState = function () {
        return this.initialStateImmutable.toJS();
    };
    Store.prototype.on = function (eventType, callback) {
        var eventTypes = [];
        if (eventType && eventType.constructor === Array) {
            eventTypes = eventType;
        }
        else {
            eventTypes = [eventType];
        }
        var event = this.eventManager.add(eventTypes, callback);
        this.eventManager.fire(StoreEventType.init, this.state);
        return event;
    };
    return Store;
}());
exports.Store = Store;
var StoreEventType;
(function (StoreEventType) {
    StoreEventType["all"] = "all";
    StoreEventType["init"] = "init";
    StoreEventType["update"] = "update";
})(StoreEventType = exports.StoreEventType || (exports.StoreEventType = {}));
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
    StoreEventManager.prototype.fire = function (type, storeState) {
        this.events.forEach(function (event) {
            if (event.types.indexOf(type) >= 0 || event.types.indexOf(StoreEventType.all) >= 0) {
                event.onFire(storeState);
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
