import React, { Component } from 'react';
//import WebSocketConn from './WebSocketConn.js';
import './App.css';
import ons from 'onsenui';
import Ons from 'react-onsenui';

export default class App extends Component {
    handleClick() {
        ons.notification.alert('Hello world!');
    }

    render() {
        return (
          <Ons.Page>
            <Ons.Button onClick={this.handleClick}>Tap me!</Ons.Button>
          </Ons.Page>
        );
    }
}

//<WebSocketConn />
