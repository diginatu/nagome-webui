import React, { Component } from 'react';
import {Page, List, ListItem, ListHeader, Icon} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';
import SettingPlugin from './SettingPlugin.js';
import SettingAccount from './SettingAccount.js';
import SettingSlots from './SettingSlots.js';
import Settings from './Settings.js';

export default class Menu extends Component {
    constructor() {
        super();

        this.refSettingPlugin = null;
        this.refSettingSlots = null;
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
                if (this.refSettings !== null)
                    this.refSettings.update(m.content);
                if (this.refSettingSlots !== null)
                    this.refSettingSlots.updateCurrent(m.content);
                break;

            case "Settings.All":
                if (this.refSettingSlots === null) return;
                this.refSettingSlots.update(m.content.config);
                break;

            default:
                console.log(m);
            }
        }
    }

    componentWillMount() {
        this.menuLists = [
            {
                title: "Comment",
                list: [
                    {text: "Connect to URI",
                        icon: "fa-link",
                        fn: () => {
                            ons.notification.prompt({
                                title: 'Connect',
                                message: 'Input Live ID or URI',
                                cancelable: true,
                                callback: (br) => {
                                    ngm.broadConnect(br);
                                },
                            }).catch(()=>{});
                        }},
                    {text: "Disconnect",
                        icon: "fa-minus-circle",
                        fn: () => {
                            ngm.broadDisconnect();
                        }},
                    {text: "Clear comments",
                        icon: "fa-trash",
                        fn: () => {
                            ngm.clearComments();
                        }},
                ],
            },
            {
                title: "Settings",
                list: [
                    {text: "Plugins",
                        icon: "fa-plug",
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
                    {text: "Settings",
                        icon: "fa-gear",
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
            },
            {
                title: "App Settings",
                list: [
                    {text: "Account",
                        icon: "fa-user",
                        fn: () => {
                            this.props.navigator.pushPage({
                                component: SettingAccount,
                                key: "Account"
                            });
                        }},
                    {text: "Setting slots",
                        icon: "fa-file-o",
                        fn: () => {
                            ngm.settingsAll();
                            this.props.navigator.pushPage({
                                component: SettingSlots,
                                props: {
                                    ref: (r) => {
                                        this.refSettingSlots = r;
                                    },
                                },
                                key: "Slots"
                            });
                        }},
                ]
            },
        ];
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
