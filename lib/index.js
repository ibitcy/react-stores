"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var StoreComponent = (function (_super) {
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
    StoreComponent.prototype.componentDidMount = function () {
        this.isStoreMounted = true;
        this.storeComponentDidMount();
    };
    StoreComponent.prototype.componentWillUnmount = function () {
        this.isStoreMounted = false;
        this.storeComponentWillUnmount();
    };
    return StoreComponent;
}(React.Component));
exports.StoreComponent = StoreComponent;

var Store = (function () {
    function Store(state) {
        this.components = [];
        this.state = null;
        this.state = state;
    }
    Store.prototype.setState = function (newState) {
        var updated = false;
        for (var property in newState) {
            if (newState.hasOwnProperty(property) && this.state.hasOwnProperty(property)) {
                if (this.state[property] !== newState[property]) {
                    this.state[property] = newState[property];
                    updated = true;
                }
            }
        }
        if (updated) {
            this.update();
        }
    };
    Store.prototype.update = function () {
        this.components.forEach(function (component) {
            if (component.isStoreMounted) {
                component.forceUpdate();
            }
        });
    };
    return Store;
}());
exports.Store = Store;
