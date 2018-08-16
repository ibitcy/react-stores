"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const test_1 = require("./test");
const counter_1 = require("./counter");
const counter_events_1 = require("./counter-events");
const counter_decorator_1 = require("./counter-decorator");
ReactDOM.render(React.createElement("main", null,
    React.createElement("h1", null, "React stores test"),
    React.createElement(test_1.Test, null),
    React.createElement(counter_1.Counter, null),
    React.createElement(counter_events_1.CounterEvents, null),
    React.createElement(counter_decorator_1.CounterDecorator, null)), document.getElementById('app'));
//# sourceMappingURL=app.js.map