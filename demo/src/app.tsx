import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Test} from './test';
import {Counter} from './counter';
import {CounterEvents} from './counter-events';
import {CounterDecorator} from "./counter-decorator";

ReactDOM.render(
	<main>
		<h1>React stores test</h1>
		<Test/>
		<Counter/>
		<CounterEvents/>
		<CounterDecorator/>
	</main>,
	document.getElementById('app')
);