import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Test } from './test';
import { Counter } from './counter';
import { CounterEvents } from './counter-events';

ReactDOM.render(
	<main>
		<h1>React stores test</h1>
		<Test/>
		<Counter/>
		<CounterEvents/>
	</main>,
	document.getElementById('app')
);