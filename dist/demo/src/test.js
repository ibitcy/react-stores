"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const store_1 = require("./store");
const actions_1 = require("./actions");
const store_2 = require("../../src/store");
class Test extends store_2.StoreComponent {
    constructor() {
        super({
            common: store_1.CommonStore.store
        });
        this.state = {
            counter: 0
        };
    }
    plusOne() {
        this.setState({
            counter: ++this.state.counter
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("h2", null, "Test component"),
            React.createElement("p", null,
                "Local state counter: ",
                this.state.counter.toString()),
            React.createElement("p", null,
                "Shared state counter: ",
                this.stores.common.state.counter.toString()),
            React.createElement("button", { onClick: this.plusOne.bind(this) }, "Local +1"),
            React.createElement("button", { onClick: () => { actions_1.CommonActions.increaseCounter(); } }, "Shared +1"),
            React.createElement("button", { onClick: () => { actions_1.CommonActions.toggleFooBar(); } },
                this.stores.common.state.foo,
                " toggle")));
    }
}
exports.Test = Test;
//# sourceMappingURL=test.js.map