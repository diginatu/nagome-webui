import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});
