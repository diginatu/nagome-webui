import React, {Component} from 'react';
import {Page, Splitter, SplitterSide, SplitterContent} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';
import Utils from './Utils.js';
import Menu from './Menu.js';
import MainFrame from './MainFrame.js';

export default class MainPage extends Component {
    constructor() {
        super();
        this.state = {
            isMenuOpen: false,
            isWsConnecting: false,
            isBroadOpen: false,
            broadInfo: null,
        };
        this.browserTab = null;

        ngm.addNgmEvHandler("nagome_ui", this.UIEventHandler.bind(this));
        ngm.addNgmEvHandler("nagome", this.nagomeEventHandler.bind(this));
    }

    setIsWsConnecting(f) {
        let t = this.state;
        t.isWsConnecting = f;
        this.setState(t);
    }

    openBroadTab() {
        if (this.state.broadInfo == null) {
            return;
        }
        this.browserTab = window.open(Utils.broadcastURL(this.state.broadInfo.broad_id), '_blank');
    }

    closeBroadTab() {
        if (this.browserTab == null || this.browserTab.closed) {
            return;
        }
        this.browserTab.close();
    }

    UIEventHandler(arrM) {
        for (const m of arrM) {
            switch (m.command) {
            case "ClearComments":
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
        }
    }

    nagomeEventHandler(arrM) {
        let st = this.state;
        let chApp = false;

        for (const m of arrM) {
            switch (m.command) {
            case 'Broad.Open':
                chApp = true;
                st.isBroadOpen = true;
                st.broadInfo = m.content;
                if (this.browserTab != null && !this.browserTab.closed) {
                    this.browserTab.location.assign(Utils.broadcastURL(st.broadInfo.broad_id));
                }
                break;
            case 'Broad.Close':
                chApp = true;
                st.isBroadOpen = false;
                st.broadInfo = null;
                break;
            default:
                console.log(m);
            }
        }

        if (chApp) this.setState(st);
    }

    setMenu(o) {
        let t = this.state;
        t.isMenuOpen = o;
        this.setState(t);
    }

    render() {
        if (this.state.broadInfo == null) {
            document.title = "Nagome";
        } else {
            document.title = this.state.broadInfo.title+" / "+this.state.broadInfo.owner_name+" - Nagome";
        }

        return (
            <Page>
                <Splitter>
                    <SplitterSide
                        side='left'
                        width='250px'
                        collapse='portrait'
                        isOpen={this.state.isMenuOpen}
                        onClose={this.setMenu.bind(this, false)}
                        onOpen={this.setMenu.bind(this, true)} >
                        <Menu
                            navigator={this.props.navigator}
                            onSelect={this.setMenu.bind(this, false)}
                            onOpenBroadTab={this.openBroadTab.bind(this)}
                            onCloseBroadTab={this.closeBroadTab.bind(this)}
                        />
                    </SplitterSide>
                    <SplitterContent>
                        <MainFrame
                            isBroadOpen={this.state.isBroadOpen}
                            isWsConnecting={this.state.isWsConnecting}
                            broadInfo={this.state.broadInfo}
                            isMenuOpen={this.state.isMenuOpen}
                            onMenuOpen={this.setMenu.bind(this, true)} />
                    </SplitterContent>
                </Splitter>
            </Page>
        );
    }
}
