"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const actions_1 = require("./actions");
const store_1 = require("./store");
class CounterEvents extends React.Component {
    constructor() {
        super(...arguments);
        this.event = null;
        this.state = {
            commonStoreState: null
        };
    }
    componentDidMount() {
        this.event = store_1.CommonStore.store.on('all', (storeState) => {
            this.setState({
                commonStoreState: storeState
            });
        });
    }
    componentWillUnmount() {
        this.event.remove();
    }
    render() {
        if (this.state.commonStoreState) {
            return (React.createElement("div", null,
                React.createElement("h2", null, "Another component with event driven states"),
                React.createElement("p", null,
                    "Shared state counter: ",
                    this.state.commonStoreState.counter.toString()),
                React.createElement("button", { onClick: () => {
                        actions_1.CommonActions.increaseCounter();
                    } }, "Shared +1")));
        }
        else {
            return null;
        }
    }
}
exports.CounterEvents = CounterEvents;
//# sourceMappingURL=counter-events.js.map