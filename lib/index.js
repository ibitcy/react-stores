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
exports.__esModule = true;
var React = require("react");
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
        this.initialState = null;
        this.state = this.copyState(state);
        this.initialState = this.copyState(state);
    }
    Store.prototype.copyState = function (state) {
        return Object.assign({}, this.state);
    };
    Store.prototype.compareObject = function (obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };
    Store.prototype.check = function (property1, property2) {
        if (property1 === null && (property1 !== property2)) {
            return false;
        }
        else if (property1 === null && (property1 === property2)) {
            return true;
        }
        else {
            switch (property1.constructor) {
                case Array:
                case Object:
                case Function: {
                    return JSON.stringify(property1) === JSON.stringify(property2);
                }
                case Number:
                case String:
                case Boolean:
                default: {
                    return property1 === property2;
                }
            }
        }
    };
    Store.prototype.setState = function (newState) {
        var prevStateCopy = this.copyState(this.state);
        var nextStateCopy = null;
        var updated = false;
        for (var property in newState) {
            if (newState.hasOwnProperty(property) && this.state.hasOwnProperty(property)) {
                if (!this.check(this.state[property], newState[property])) {
                    this.state[property] = newState[property];
                    updated = true;
                }
            }
        }
        if (updated) {
            nextStateCopy = this.copyState(this.state);
            this.update(prevStateCopy, nextStateCopy);
        }
    };
    Store.prototype.resetState = function () {
        this.setState(this.initialState);
    };
    Store.prototype.update = function (prevStateCopy, nextStateCopy) {
        this.components.forEach(function (component) {
            if (component.isStoreMounted) {
                component.storeComponentStoreWillUpdate();
                component.forceUpdate();
                component.storeComponentStoreDidUpdate();
            }
        });
    };
    return Store;
}());
exports.Store = Store;
