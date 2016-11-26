import React, { Component } from 'react';
import {Page, List, ListItem, Icon} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';

export default class Menu extends Component {
    componentWillMount() {
        this.menuList = [
            { text: "Connect to URI",
                icon: "fa-link",
                fn: () => {
                    ons.notification.prompt({
                        title: 'Connect',
                        message: 'Input Live ID or URI',
                        cancelable: true,
                        callback: (br) => {
                            ngm.broadConnect(br);
                        },
                    });
                }},
            {text: "Disconnect",
                icon: "fa-minus-circle",
                fn: () => {
                    ngm.broadDisconnect();
                }},
            {text: "Clear comments",
                icon: "fa-file-o",
                fn: () => {
                    ngm.clearComments();
                }},
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
                        <ListItem key={m.text} onClick={this.handleMenuSelect.bind(this, m.fn)} tappable modifier="nodivider">
                            <div className="left">
                                <Icon icon={m.icon} />
                            </div>
                            <div className="center">
                                {m.text}
                            </div>
                        </ListItem>
                    )}
                />
            </Page>
            );
    }
}
