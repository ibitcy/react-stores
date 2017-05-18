import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Test } from './test';
import { Counter } from './counter';

ReactDOM.render(
	<main>
		<h1>React stores test</h1>
		<Test/>
		<Counter/>
	</main>,
	document.getElementById('app')
);