'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

(function (StoreEventType) {
    StoreEventType[StoreEventType["All"] = 0] = "All";
    StoreEventType[StoreEventType["Init"] = 1] = "Init";
    StoreEventType[StoreEventType["Update"] = 2] = "Update";
    StoreEventType[StoreEventType["DumpUpdate"] = 3] = "DumpUpdate";
})(exports.StoreEventType || (exports.StoreEventType = {}));
var StoreEvent = /** @class */ (function () {
    function StoreEvent(id, types, onFire, onRemove) {
        this.id = id;
        this.types = types;
        this.onFire = onFire;
        this.onRemove = onRemove;
        this.timeout = null;
    }
    StoreEvent.prototype.remove = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.onRemove(this.id);
    };
    return StoreEvent;
}());
var StoreEventSpecificKeys = /** @class */ (function () {
    function StoreEventSpecificKeys(id, types, onFire, onRemove, includeKeys) {
        if (includeKeys === void 0) { includeKeys = []; }
        this.id = id;
        this.types = types;
        this.onFire = onFire;
        this.onRemove = onRemove;
        this.includeKeys = includeKeys;
        this.timeout = null;
    }
    StoreEventSpecificKeys.prototype.remove = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.onRemove(this.id);
    };
    return StoreEventSpecificKeys;
}());

var followStore = function (store) { return function (WrappedComponent) {
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
            this.storeEvent = store.on(exports.StoreEventType.All, function () {
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

var StorePersistentDriver = /** @class */ (function () {
    function StorePersistentDriver(name, lifetime) {
        if (lifetime === void 0) { lifetime = Infinity; }
        this.name = name;
        this.lifetime = lifetime;
        this.persistence = true;
        this.initialState = null;
    }
    StorePersistentDriver.prototype.pack = function (data) {
        return {
            data: data,
            timestamp: Date.now(),
        };
    };
    StorePersistentDriver.prototype.reset = function () {
        var pack = this.pack(this.initialState);
        this.write(pack);
        return pack;
    };
    Object.defineProperty(StorePersistentDriver.prototype, "storeName", {
        get: function () {
            return ("store.persistent." + this.type + "." + this.name).toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StorePersistentDriver.prototype, "dumpHistoryName", {
        get: function () {
            return ("store.persistent.dump.history." + this.type + "." + this.name).toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    return StorePersistentDriver;
}());

var StorePersistentLocalStorageDriver = /** @class */ (function (_super) {
    __extends(StorePersistentLocalStorageDriver, _super);
    function StorePersistentLocalStorageDriver(name, lifetime) {
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
    StorePersistentLocalStorageDriver.prototype.write = function (pack) {
        if (this.storage && this.persistence) {
            try {
                this.storage.setItem(this.storeName, JSON.stringify(pack));
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    StorePersistentLocalStorageDriver.prototype.read = function () {
        if (this.storage && this.persistence) {
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
    StorePersistentLocalStorageDriver.prototype.saveDump = function (pack) {
        var timestamp = pack.timestamp;
        if (this.storage && this.persistence) {
            try {
                var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHistoryName));
                if (dumpHistory && dumpHistory.dumpHistory) {
                    dumpHistory.dumpHistory.push(pack);
                    this.storage.setItem(this.dumpHistoryName, JSON.stringify(dumpHistory));
                }
                else {
                    this.storage.setItem(this.dumpHistoryName, JSON.stringify({
                        dumpHistory: [pack],
                    }));
                }
            }
            catch (e) {
                try {
                    this.storage.setItem(this.dumpHistoryName, JSON.stringify({
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
    StorePersistentLocalStorageDriver.prototype.removeDump = function (timestamp) {
        if (this.storage && this.persistence) {
            try {
                var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHistoryName));
                if (dumpHistory && dumpHistory.dumpHistory) {
                    var newDumpHistory = dumpHistory.dumpHistory.filter(function (dump) { return dump.timestamp !== timestamp; });
                    this.storage.setItem(this.dumpHistoryName, JSON.stringify({
                        dumpHistory: newDumpHistory,
                    }));
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    StorePersistentLocalStorageDriver.prototype.readDump = function (timestamp) {
        var dump = null;
        if (this.storage && this.persistence) {
            try {
                var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHistoryName));
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
        }
        return dump;
    };
    StorePersistentLocalStorageDriver.prototype.getDumpHistory = function () {
        var history = [];
        if (this.storage && this.persistence) {
            try {
                var dumpHistory = JSON.parse(this.storage.getItem(this.dumpHistoryName));
                if (dumpHistory && dumpHistory.dumpHistory) {
                    history = dumpHistory.dumpHistory.map(function (pack) { return pack.timestamp; });
                }
            }
            catch (e) {
                console.error(e);
                history = [];
            }
        }
        return history;
    };
    StorePersistentLocalStorageDriver.prototype.resetHistory = function () {
        if (this.storage && this.persistence) {
            try {
                this.storage.setItem(this.dumpHistoryName, JSON.stringify({
                    dumpHistory: [],
                }));
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    StorePersistentLocalStorageDriver.prototype.clear = function () {
        if (this.storage && this.persistence) {
            try {
                this.storage.removeItem(this.storeName);
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    return StorePersistentLocalStorageDriver;
}(StorePersistentDriver));
{
    StorePersistentLocalStorageDriver['__constructorName'] = 'StorePersistentLocalStorageDriver';
}

function getClass(obj) {
    return {}.toString.call(obj).slice(8, -1);
}
function isPrimitive(object) {
    switch (typeof object) {
        case 'undefined':
        case 'boolean':
        case 'number':
        case 'string':
        case 'symbol': {
            return true;
        }
        default: {
            return false;
        }
    }
}
function areSimilar(a, b) {
    var exceptionList = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        exceptionList[_i - 2] = arguments[_i];
    }
    // 100% similar things, including primitives
    if (a === b) {
        return true;
    }
    // early check for primitives with different values
    // or one not being a primitive
    if (isPrimitive(a) || isPrimitive(b)) {
        return a === b;
    }
    // typeof null is object, but if both were null that would have been already detected.
    if (a === null || b === null) {
        return false;
    }
    if (typeof a === typeof b) {
        switch (getClass(a)) {
            case "Date":
                return a.getTime() === b.getTime();
        }
    }
    if ((Array.isArray(a) && !Array.isArray(b)) || (!Array.isArray(a) && Array.isArray(b))) {
        return false;
    }
    // Object similarity is determined by the same set of keys NOT in
    // the exception list (although not necessarily the same order), and equivalent values for every
    // corresponding key NOT in the exception list.
    var exceptionListSet = new Set(exceptionList);
    var setKeysA = new Set(Object.keys(a));
    var setKeysB = new Set(Object.keys(b));
    // make sure that exception list key are included
    // so it does not fail in the following steps.
    for (var _a = 0, exceptionList_1 = exceptionList; _a < exceptionList_1.length; _a++) {
        var key = exceptionList_1[_a];
        setKeysA.add(key);
        setKeysB.add(key);
    }
    // after adding all the keys from the exception list they
    // should have the same number of keys
    if (setKeysA.size !== setKeysB.size) {
        return false;
    }
    var keysA = Array.from(setKeysA);
    var keysB = Array.from(setKeysB);
    // the same set of keys, but not neccesarily same order
    keysA.sort();
    keysB.sort();
    // key test
    for (var i = keysA.length - 1; i >= 0; i--) {
        if (keysA[i] !== keysB[i]) {
            return false;
        }
    }
    for (var i = keysA.length - 1; i >= 0; i--) {
        var key = keysA[i];
        // just compare if not in the exception list.
        if (!exceptionListSet.has(key) && !areSimilar.apply(void 0, __spreadArrays([a[key], b[key]], exceptionList))) {
            return false;
        }
    }
    return typeof a === typeof b;
}

var StoreEventManager = /** @class */ (function () {
    function StoreEventManager(fireTimeout, name) {
        this.fireTimeout = fireTimeout;
        this.name = name;
        this.events = [];
        this.eventCounter = 0;
        this.timeout = null;
        this._hook = null;
        this._hook = typeof window !== 'undefined' && window['__REACT_STORES_INSPECTOR__'];
    }
    StoreEventManager.prototype.getEventsCount = function () {
        return this.events.length;
    };
    StoreEventManager.prototype.generateEventId = function () {
        return "" + ++this.eventCounter + Date.now() + Math.random();
    };
    StoreEventManager.prototype.fire = function (type, storeState, prevState, event) {
        var _this = this;
        if (event) {
            if (this.fireTimeout && this.fireTimeout !== 0) {
                if (event.timeout) {
                    clearTimeout(this.timeout);
                }
                event.timeout = setTimeout(function () {
                    _this.doFire(type, storeState, prevState, event);
                }, this.fireTimeout);
            }
            else {
                this.doFire(type, storeState, prevState, event);
            }
        }
        else {
            if (this.fireTimeout && this.fireTimeout !== 0) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(function () {
                    for (var key in _this.events) {
                        if (_this.events.hasOwnProperty(key)) {
                            _this.doFire(type, storeState, prevState, _this.events[key]);
                        }
                    }
                }, this.fireTimeout);
            }
            else {
                for (var key in this.events) {
                    if (this.events.hasOwnProperty(key)) {
                        this.doFire(type, storeState, prevState, this.events[key]);
                    }
                }
            }
        }
    };
    StoreEventManager.prototype.remove = function (id) {
        if (this.fireTimeout && this.fireTimeout !== 0) {
            for (var key in this.events) {
                if (this.events.hasOwnProperty(key) && this.events[key].timeout) {
                    clearTimeout(this.timeout);
                }
            }
        }
        this.events = this.events.filter(function (event) {
            return event.id !== id;
        });
        if (this._hook) {
            this._hook.removeEvent(this.name, id);
        }
    };
    StoreEventManager.prototype.add = function (eventTypes, callback, includeKeys) {
        var _this = this;
        var event;
        if (includeKeys) {
            event = new StoreEventSpecificKeys(this.generateEventId(), eventTypes, callback, function (id) {
                _this.remove(id);
            }, includeKeys);
        }
        else {
            event = new StoreEvent(this.generateEventId(), eventTypes, callback, function (id) {
                _this.remove(id);
            });
        }
        this.events.push(event);
        if (this._hook) {
            this._hook.addEvent(this.name, event.id);
        }
        return event;
    };
    StoreEventManager.prototype.doFire = function (type, storeState, prevState, event) {
        if (event.types.includes(type) || event.types.includes(exports.StoreEventType.All)) {
            if (event instanceof StoreEventSpecificKeys) {
                var excludedKeys = Object.keys(storeState).filter(function (key) { return !event.includeKeys.includes(key); });
                if (!areSimilar.apply(void 0, __spreadArrays([storeState, prevState], excludedKeys))) {
                    event.onFire(storeState, prevState, event.includeKeys, type);
                }
                return;
            }
            event.onFire(storeState, prevState, type);
        }
    };
    return StoreEventManager;
}());

var cloneDeep = require('clone-deep');
var Store = /** @class */ (function () {
    function Store(initialState, options, persistenceDriver) {
        var _this = this;
        var _a;
        this.persistenceDriver = persistenceDriver;
        this.version =  "5.5.0" ;
        this.eventManager = null;
        this.initialState = null;
        this.frozenState = null;
        this._hook = null;
        this.opts = {
            name: '',
            live: false,
            freezeInstances: false,
            immutable: false,
            persistence: false,
            setStateTimeout: 0,
            asyncPersistence: false,
        };
        this._hook = typeof window !== 'undefined' && window['__REACT_STORES_INSPECTOR__'];
        {
            if (['number', 'boolean', 'string', 'undefined', 'symbol', 'bigint'].includes(typeof initialState)) {
                throw new Error('InitialState must be an object, passed: ' + typeof initialState);
            }
            if ([Array, Function, Map, Promise, Set].some(function (item) { return initialState instanceof item; })) {
                throw new Error('InitialState must be an object, passed: ' + initialState.constructor.name);
            }
        }
        var currentState = null;
        this.name = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : this.generateStoreId(initialState);
        if (options) {
            this.opts.name = this.name;
            this.opts.immutable = options.immutable === true;
            this.opts.persistence = options.persistence === true;
            this.opts.setStateTimeout = options.setStateTimeout;
            this.opts.asyncPersistence = options.asyncPersistence === true;
        }
        if (!this.persistenceDriver) {
            this.persistenceDriver = new StorePersistentLocalStorageDriver(this.name + this.generateStoreId(initialState));
        }
        if (this.opts.persistence) {
            if (this.opts.asyncPersistence) {
                this.persistenceDriver
                    .readAsync()
                    .then(function (result) {
                    if (result && result.data) {
                        _this.setState(result.data);
                    }
                });
            }
            else {
                var persistentState = this.persistenceDriver.read().data;
                if (persistentState) {
                    currentState = cloneDeep(persistentState);
                }
            }
        }
        this.execStateInitialization(initialState, currentState);
    }
    Object.defineProperty(Store.prototype, "state", {
        get: function () {
            return this.frozenState;
        },
        enumerable: false,
        configurable: true
    });
    Store.prototype.execStateInitialization = function (initialState, currentState) {
        var clonedInitialState = cloneDeep(initialState);
        var frozenState = currentState === null ? clonedInitialState : currentState;
        this.persistenceDriver.persistence = this.opts.persistence;
        this.eventManager = new StoreEventManager(this.opts.setStateTimeout, this.name);
        this.initialState = this.deepFreeze(clonedInitialState);
        this.frozenState = this.deepFreeze(frozenState);
        if (this._hook) {
            this._hook.attachStore(this, this.name, this.opts, false);
        }
    };
    Store.prototype.deepFreeze = function (obj) {
        if (this.opts.immutable) {
            var propNames = Object.getOwnPropertyNames(obj);
            for (var key in propNames) {
                if (propNames.hasOwnProperty(key)) {
                    var prop = obj[propNames[key]];
                    if (typeof prop === 'object' && prop !== null) {
                        this.deepFreeze(prop);
                    }
                }
            }
            return Object.freeze(obj);
        }
        else {
            return obj;
        }
    };
    Store.prototype.hashCode = function (str) {
        var h = 0;
        for (var i = 0; i < str.length; i++) {
            h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
        }
        return h.toString(16);
    };
    Store.prototype.generateStoreId = function (state) {
        var flatKeys = '';
        for (var key in state) {
            if (state.hasOwnProperty(key)) {
                flatKeys += key;
            }
        }
        return this.hashCode(flatKeys);
    };
    Store.prototype.resetPersistence = function () {
        this.persistenceDriver.reset();
    };
    Store.prototype.clearPersistence = function () {
        this.persistenceDriver.clear();
    };
    Store.prototype.resetDumpHistory = function () {
        this.persistenceDriver.resetHistory();
        this.eventManager.fire(exports.StoreEventType.DumpUpdate, this.frozenState, this.frozenState);
    };
    Store.prototype.saveDump = function () {
        var timestamp = this.persistenceDriver.saveDump(this.persistenceDriver.pack(this.frozenState));
        this.eventManager.fire(exports.StoreEventType.DumpUpdate, this.frozenState, this.frozenState);
        return timestamp;
    };
    Store.prototype.removeDump = function (timestamp) {
        this.persistenceDriver.removeDump(timestamp);
        this.eventManager.fire(exports.StoreEventType.DumpUpdate, this.frozenState, this.frozenState);
    };
    Store.prototype.restoreDump = function (timestamp) {
        var pack = this.persistenceDriver.readDump(timestamp);
        if (pack) {
            var prevState = this.deepFreeze(this.frozenState);
            this.setState(__assign(__assign({}, pack.data), { $actionName: '@restoreDump' }));
            this.eventManager.fire(exports.StoreEventType.DumpUpdate, this.frozenState, prevState);
        }
    };
    Store.prototype.getDumpHistory = function () {
        return this.persistenceDriver.getDumpHistory();
    };
    Store.prototype.setState = function (_a) {
        var $actionName = _a.$actionName, newState = __rest(_a, ["$actionName"]);
        var prevState = this.deepFreeze(this.frozenState);
        var updatedState = this.deepFreeze(__assign(__assign({}, prevState), newState));
        this.frozenState = updatedState;
        this.execWrite(prevState, updatedState, $actionName);
    };
    Store.prototype.execWrite = function (prevState, updatedState, $actionName) {
        var _this = this;
        if (this.opts.asyncPersistence) {
            this.persistenceDriver
                .writeAsync(this.persistenceDriver.pack(updatedState))
                .then(function () {
                _this.eventManager.fire(exports.StoreEventType.Update, updatedState, prevState);
                if (_this._hook) {
                    _this._hook.updateState(_this.name, updatedState, $actionName);
                }
            });
        }
        else {
            this.persistenceDriver.write(this.persistenceDriver.pack(updatedState));
            this.eventManager.fire(exports.StoreEventType.Update, updatedState, prevState);
            if (this._hook) {
                this._hook.updateState(this.name, updatedState, $actionName);
            }
        }
    };
    Store.prototype.resetState = function () {
        this.setState(__assign(__assign({}, this.getInitialState()), { $actionName: '@resetState' }));
    };
    Store.prototype.removeStore = function () {
        if (this._hook) {
            this._hook.removeStore(this.name);
        }
    };
    Store.prototype.getInitialState = function () {
        return this.deepFreeze(cloneDeep(this.initialState));
    };
    Store.prototype.on = function (eventType, secondArg, thirdArg) {
        var eventTypes = eventType && eventType.constructor === Array
            ? eventType
            : [eventType];
        var event;
        if (Array.isArray(secondArg)) {
            event = this.eventManager.add(eventTypes, thirdArg, secondArg);
        }
        else {
            event = this.eventManager.add(eventTypes, secondArg);
        }
        this.eventManager.fire(exports.StoreEventType.Init, this.frozenState, this.frozenState, event);
        this.eventManager.fire(exports.StoreEventType.DumpUpdate, this.frozenState, this.frozenState, event);
        return event;
    };
    return Store;
}());

function getOption(rest) {
    var mapState = function (store) { return store; };
    var compare = function (a, b) { return a === b; };
    var eventType = exports.StoreEventType.All;
    var includeKeys = [];
    if (rest[0] &&
        (Object.keys(exports.StoreEventType).includes(rest[0].toString()) ||
            (Array.isArray(rest[0]) && Object.keys(exports.StoreEventType).includes(rest[0][0].toString())))) {
        return {
            eventType: rest[0],
            mapState: rest[1] || mapState,
            compare: rest[2] || compare,
            includeKeys: includeKeys,
        };
    }
    else if (rest[0] && Array.isArray(rest[0]) && typeof rest[0][0] === 'string') {
        return {
            eventType: rest[1] || eventType,
            mapState: mapState,
            compare: compare,
            includeKeys: rest[0],
        };
    }
    else if (typeof rest[0] === 'function') {
        return {
            eventType: eventType,
            mapState: rest[0] || mapState,
            compare: rest[1] || compare,
            includeKeys: includeKeys,
        };
    }
    else if (rest[0]) {
        return {
            eventType: rest[0].eventType || eventType,
            mapState: rest[0].mapState || mapState,
            compare: rest[0].compare || compare,
            includeKeys: includeKeys,
        };
    }
    return {
        mapState: mapState,
        compare: compare,
        eventType: eventType,
        includeKeys: includeKeys,
    };
}
function useStore(store) {
    var restParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restParams[_i - 1] = arguments[_i];
    }
    var params = React.useMemo(function () {
        return getOption(restParams);
    }, []);
    var storeRef = React.useRef(store);
    var initialRef = React.useMemo(function () { return params.mapState(storeRef.current.state); }, []);
    var recountId = React.useRef(0);
    var recount = React.useState(0);
    var state = React.useRef(initialRef);
    React.useEffect(function () {
        var storeEvent;
        if (params.includeKeys.length > 0) {
            storeEvent = storeRef.current.on(params.eventType, params.includeKeys, function (storeState) {
                state.current = params.mapState(storeState);
                recountId.current = recountId.current + 1;
                recount[1](recountId.current);
            });
        }
        else {
            storeEvent = storeRef.current.on(params.eventType, function (storeState, prevState, type) {
                var nextState = params.mapState(storeState, prevState, type);
                if (!params.compare || !params.compare(nextState, state.current)) {
                    state.current = nextState;
                    recountId.current = recountId.current + 1;
                    recount[1](recountId.current);
                }
            });
        }
        return function () {
            storeEvent.remove();
        };
    }, []);
    return state.current;
}

function useIsolatedStore(initialState, storeOptions, persistenceDriver) {
    var recount = React__default.useState(0);
    var storeRef = React__default.useRef(React__default.useMemo(function () {
        return new Store(initialState, __assign({ persistence: false, immutable: true }, storeOptions), persistenceDriver);
    }, []));
    React__default.useEffect(function () {
        var event = storeRef.current.on(exports.StoreEventType.Update, function () {
            recount[1](Date.now());
        });
        return function () {
            event.remove();
            if (!(storeOptions === null || storeOptions === void 0 ? void 0 : storeOptions.persistence)) {
                storeRef.current.resetState();
            }
            storeRef.current.removeStore();
        };
    }, []);
    return storeRef.current;
}

// react-native adaptation
var StorePersistentDriverAsync = /** @class */ (function (_super) {
    __extends(StorePersistentDriverAsync, _super);
    function StorePersistentDriverAsync() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StorePersistentDriverAsync.prototype.write = function (pack) { };
    StorePersistentDriverAsync.prototype.read = function () {
        return undefined;
    };
    StorePersistentDriverAsync.prototype.saveDump = function (pack) {
        return 0;
    };
    StorePersistentDriverAsync.prototype.readDump = function (id) {
        return undefined;
    };
    StorePersistentDriverAsync.prototype.getDumpHistory = function () {
        return [];
    };
    StorePersistentDriverAsync.prototype.removeDump = function (timestamp) { };
    StorePersistentDriverAsync.prototype.resetHistory = function () { };
    return StorePersistentDriverAsync;
}(StorePersistentDriver));

exports.Store = Store;
exports.StoreEvent = StoreEvent;
exports.StorePersistentDriver = StorePersistentDriver;
exports.StorePersistentDriverAsync = StorePersistentDriverAsync;
exports.StorePersistentLocalStorageDriver = StorePersistentLocalStorageDriver;
exports.areSimilar = areSimilar;
exports.followStore = followStore;
exports.useIsolatedStore = useIsolatedStore;
exports.useStore = useStore;
