import React, {Component} from 'react';
import {Page, Splitter, SplitterSide, SplitterContent} from 'react-onsenui';
import ons from 'onsenui';

import {ngm, NagomeInit} from './NagomeConn.js';

import Menu from './Menu.jsx';
import MainFrame from './MainFrame.jsx';

export default class MainPage extends Component {
    constructor() {
        super();
        this.state = {
            menuIsOpen: false,
            wsIsConnecting: false,
            isBroadOpen: false,
            broadInfo: {},
        };

        NagomeInit(this.nagomeEventHandler.bind(this),
                this.websocketEventHandler.bind(this));
        ngm.connectWs();
    }

    nagomeEventHandler(arrM) {
        let comment = this.refs.mainframe.refs.comment;
        let stApp = this.state;
        let chApp = false;
        let stComment = comment.state;
        let chComment = false;

        for (let i = 0, len = arrM.length; i < len; i++) {
            let m = arrM[i];

            switch (m.domain) {
            case 'nagome':
                switch (m.command) {
                case 'Broad.Open':
                    chApp = true;
                    stApp.isBroadOpen = true;
                    stApp.broadInfo = m.content;
                    break;
                case 'Broad.Close':
                    chApp = true;
                    stApp.isBroadOpen = false;
                    stApp.broadInfo = {};
                    break;
                default:
                    console.log(m);
                }
                break;
            case 'nagome_comment':
                if (m.command === "Got") {
                    chComment = true;
                    m.content.date = m.content.date.split(RegExp('[T.]'))[1];
                    stComment.data.push(m.content);
                } else {
                    console.log(m);
                }
                break;
            case 'nagome_ui':
                switch (m.command) {
                case "ClearComments":
                    chComment = true;
                    stComment = { data: [] };
                    break;
                case "Dialog":
                    switch (m.content.type) {
                    case 'Info':
                    case 'Warn':
                        ons.notification.alert({
                            title: m.content.type+" : "+m.content.title,
                            message: m.content.description,
                            cancelable: true,
                        }).catch((e)=>{});

                        break;
                    default:
                        console.log(m);
                    }
                    break;
                default:
                    console.log(m);
                }
                break;
            case 'nagome_direct':
                switch (m.command) {
                case "Plug.List":
                    chComment = true;
                    stComment = { data: [] };
                    break;
                default:
                    console.log(m);
                }
                break;
            default:
                console.log(m);
            }
        }

        if (chComment) comment.setState(stComment);
        if (chApp) this.setState(stApp);
    }

    websocketEventHandler(e) {
        console.log(e);

        let t = this.state;
        switch (e) {
        case 'close':
            t.wsIsConnecting = true;
            window.setTimeout(ngm.connectWs.bind(ngm), 5000);
            break;
        case 'err':
            t.wsIsConnecting = true;
            break;
        case 'open':
            t.wsIsConnecting = false;
            break;
        default:
            console.log("Unknown ws event", e);
        }
        this.setState(t);
    }

    setMenu(o) {
        let t = this.state;
        t.menuIsOpen = o;
        this.setState(t);
    }

    render() {
        if (this.state.broadInfo.title !== undefined) {
            document.title = this.state.broadInfo.title+" / "+this.state.broadInfo.owner_name+" - Nagome";
        } else {
            document.title = "Nagome";
        }

        return (
            <Page>
                <Splitter>
                    <SplitterSide
                        side='left'
                        width={200}
                        collapse={true}
                        isOpen={this.state.menuIsOpen}
                        onClose={this.setMenu.bind(this, false)}
                        onOpen={this.setMenu.bind(this, true)} >
                        <Menu
                            navigator={this.props.navigator}
                            onSelect={this.setMenu.bind(this, false)} />
                    </SplitterSide>
                    <SplitterContent>
                        <MainFrame
                            ref="mainframe"
                            isBroadOpen={this.state.isBroadOpen}
                            wsIsConnecting={this.state.wsIsConnecting}
                            broadTitle={document.title}
                            onMenuOpen={this.setMenu.bind(this, true)} />
                    </SplitterContent>
                </Splitter>
            </Page>
            );
    }
}
