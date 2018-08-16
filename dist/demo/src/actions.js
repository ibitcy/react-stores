"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
class CommonActions {
    static increaseCounter() {
        store_1.CommonStore.store.setState({
            counter: store_1.CommonStore.store.state.counter + 1
        });
    }
    static toggleFooBar() {
        let newState = {
            foo: (store_1.CommonStore.store.state.foo === 'foo') ? 'bar' : 'foo'
        };
        store_1.CommonStore.store.setState(newState);
    }
    static reset() {
        store_1.CommonStore.store.resetState();
    }
    static setSettings(bar, baz) {
        store_1.CommonStore.store.setState({
            settings: {
                foo: {
                    bar: bar
                },
                baz: baz
            }
        });
    }
    static setNull(obj) {
        store_1.CommonStore.store.setState({
            nullObj: obj
        });
    }
}
exports.CommonActions = CommonActions;
//# sourceMappingURL=actions.js.map