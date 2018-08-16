"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const actions_1 = require("./actions");
const store_1 = require("../../src/store");
const store_2 = require("./store");
class Counter extends store_1.StoreComponent {
    constructor() {
        super({
            common: store_2.CommonStore.store
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("h2", null, "Another comonent"),
            React.createElement("p", null,
                "FooBar state is ",
                React.createElement("strong", null, this.stores.common.state.foo)),
            React.createElement("p", null,
                "Shared state counter: ",
                this.stores.common.state.counter.toString()),
            React.createElement("button", { onClick: () => { actions_1.CommonActions.increaseCounter(); } }, "Shared +1")));
    }
}
exports.Counter = Counter;
//# sourceMappingURL=counter.js.map