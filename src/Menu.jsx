import React, { Component } from 'react';
import {Page, List, ListItem, ListHeader, Icon} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';
import SettingPlugin from './SettingPlugin.jsx';
import SettingAccount from './SettingAccount.jsx';
import Settings from './Settings.jsx';

export default class Menu extends Component {
    constructor() {
        super();

        this.refSettingPlugin = null;
        this.refSettings = null;

        ngm.addNgmEvHandler("nagome_directngm", this.settingsDirectHandler.bind(this));
    }

    settingsDirectHandler(arrM) {
        for (let i = 0, len = arrM.length; i < len; i++) {
            let m = arrM[i];
            switch (m.command) {
            case "Plug.List":
                if (this.refSettingPlugin === null) return;
                this.refSettingPlugin.updateList(m.content.plugins);
                break;

            case "Settings.Current":
                if (this.refSettings === null) return;
                this.refSettings.update(m.content);
                break;

            default:
                console.log(m);
            }
        }
    }

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
                            ngm.pluginList();
                            this.props.navigator.pushPage({
                                component: SettingPlugin,
                                props: {
                                    ref: (r) => {
                                        this.refSettingPlugin = r;
                                    },
                                },
                                key: "Plugins"
                            });
                        }},
                    {text: "Account",
                        icon: "fa-file-o",
                        fn: () => {
                            this.props.navigator.pushPage({
                                component: SettingAccount,
                                key: "Account"
                            });
                        }},
                    {text: "Settings",
                        icon: "fa-file-o",
                        fn: () => {
                            ngm.settingsCurrent();
                            this.props.navigator.pushPage({
                                component: Settings,
                                props: {
                                    ref: (r) => {
                                        this.refSettings = r;
                                    },
                                },
                                key: "Settings"
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
