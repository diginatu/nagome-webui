import React, { Component } from 'react';
import {Page, List, ListItem} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';

export default class Menu extends Component {
    componentWillMount() {
        this.menuList = [
            {text: "Connect", fn: () => {
                ons.notification.prompt('Input Live ID or URI').then(
                    (br) => {
                        console.log(br);
                        ngm.broadConnect(br);
                    }
                );
                console.log("connect");
            }}
        ];
    }

    handleMenuSelect(f) {
        this.props.onSelect();
        f();
    }

    render() {
        return (
            <Page>
                <List
                    dataSource={this.menuList}
                    renderRow={(m) => (
                        <ListItem key={m.text} onClick={this.handleMenuSelect.bind(this, m.fn)} tappable >
                            {m.text}
                        </ListItem>
                    )}
                />
            </Page>
            );
    }
}
