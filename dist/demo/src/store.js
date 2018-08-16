"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../src/store");
var CommonStore;
(function (CommonStore) {
    // Store's state initial values
    CommonStore.initialState = {
        nullObj: null,
        counter: 0,
        foo: 'foo',
        numericArray: [1, 2, 3],
        objectsArray: [{
                a: 1,
                b: 2,
                c: 3
            },
            {
                a: 3,
                b: 2,
                c: {
                    a: 1,
                    b: [1, 2, 3]
                },
                d: [
                    { id: 1, name: 'test 1', enabled: true },
                    { id: 2, name: 'test 2', enabled: false }
                ]
            }],
        settings: {
            foo: {
                bar: 1
            },
            baz: 2
        }
    };
    CommonStore.store = new store_1.Store(CommonStore.initialState, {
        live: true,
    });
})(CommonStore = exports.CommonStore || (exports.CommonStore = {}));
//# sourceMappingURL=store.js.map