"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const actions_1 = require("./actions");
const store_1 = require("../../src/store");
const store_2 = require("./store");
let CounterDecorator = class CounterDecorator extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("h2", null, "Component with store decorator"),
            React.createElement("p", null,
                "Shared state counter: ",
                store_2.CommonStore.store.state.counter.toString()),
            React.createElement("button", { onClick: () => {
                    actions_1.CommonActions.increaseCounter();
                } }, "Shared +1")));
    }
};
CounterDecorator = __decorate([
    store_1.followStore(store_2.CommonStore.store, ['counter'])
], CounterDecorator);
exports.CounterDecorator = CounterDecorator;
//# sourceMappingURL=counter-decorator.js.map