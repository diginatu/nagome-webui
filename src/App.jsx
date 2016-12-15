import React, {Component} from 'react';
import {Navigator} from 'react-onsenui';
import MainPage from './MainPage.jsx';

export default class App extends Component {
    renderPage(route, navigator) {
        let props = route.props || {};
        props.navigator = navigator;
        props.key = route.key || route.component.name;
        return React.createElement(route.component, props);
    }

    render() {
        return (
            <Navigator
                renderPage={this.renderPage}
                initialRoute={{
                    component: MainPage,
                }}
            />
        );
    }
}
