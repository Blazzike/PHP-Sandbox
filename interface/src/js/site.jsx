import '@babel/polyfill';

import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/App';

let appRef = React.createRef();
ReactDOM.render(<App ref={appRef} loading={false}/>, document.getElementById('wrapper'));

export let app = appRef.current;
window.app = app;