import React, { Component } from 'react';
import {Page, List, ListItem, ListHeader, Icon} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';
import AccountSetting from './AccountSetting.jsx';

export default class Menu extends Component {
    componentWillMount() {
        this.menuLists = [{
            title: "Comment",
            list: [
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
            ],
        },
        {
            title: "settings",
            list: [
                {text: "Plugins",
                    icon: "fa-file-o",
                    fn: () => {
                        this.props.navigator.pushPage({
                            component: AccountSetting,
                        });
                    }},
            ]
        }];
    }

    handleMenuSelect(f) {
        this.props.onSelect();
        f();
    }

    renderRow(m) {
        return (
            <ListItem key={m.text} onClick={this.handleMenuSelect.bind(this, m.fn)} tappable>
                <div className="left">
                    <Icon icon={m.icon} />
                </div>
                <div className="center">
                    {m.text}
                </div>
            </ListItem>
               );
    }

    renderLists(lists) {
        return lists.map((list)=>{
            return (
                <List
                    key={list.title}
                    dataSource={list.list}
                    renderRow={this.renderRow.bind(this)}
                    renderHeader={() => 
                        <ListHeader>{list.title}</ListHeader>
                    }
                />
                );
        });
    }

    render() {
        return (
            <Page>
                {this.renderLists(this.menuLists)}
            </Page>
            );
    }
}
