import React, {Component} from 'react';
import {Navigator} from 'react-onsenui';
import {ngm, NagomeInit} from './NagomeConn.js';
import MainPage from './MainPage.js';

export default class App extends Component {
    constructor() {
        super();

        NagomeInit(this.websocketEventHandler.bind(this));
        ngm.connectWs();
    }

    websocketEventHandler(e) {
        console.log(e);
        let t;
        switch (e) {
        case 'close':
            t = true;
            window.setTimeout(ngm.connectWs.bind(ngm), 5000);
            break;
        case 'err':
            t = true;
            break;
        case 'open':
            t = false;
            break;
        default:
            console.log("Unknown ws event", e);
        }
        this.refMainPage.setIsWsConnecting(t);
    }

    renderPage(route, navigator) {
        let props = route.props || {};
        props.navigator = navigator;
        if (route.key != null) {
            props.key = route.key;
        } else {
            console.log("Navigator pushed without key.");
            console.log(route);
        }
        return React.createElement(route.component, props);
    }

    render() {
        return (
            <Navigator
                renderPage={this.renderPage.bind(this)}
                initialRoute={{
                    component: MainPage,
                    props: {
                        ref: (r) => {
                            this.refMainPage = r;
                        }
                    },
                    key: "MainPage"
                }}
            />
        );
    }
}
