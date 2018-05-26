import React, {Component} from 'react';
import {Page, Splitter, SplitterSide, SplitterContent, Modal, Button} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';
import Utils from './Utils.js';
import Menu from './Menu.js';
import MainFrame from './MainFrame.js';
import {version, name} from '../package.json';

export default class MainPage extends Component {
    constructor() {
        super();
        this.state = {
            isMenuOpen: false,
            isWsConnecting: false,
            isBroadOpen: false,
            broadInfo: null,
            appVersionModalIsOpen: false,
            appVersion: null,
        };
        this.browserTab = null;

        ngm.addNgmEvHandler("nagome_ui", this.UIEventHandler.bind(this));
        ngm.addNgmEvHandler("nagome", this.nagomeEventHandler.bind(this));
        ngm.addNgmEvHandler("nagome_directngm", this.nagomeDirectEventHandler.bind(this));
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
            case "Notification":
                switch (m.content.type) {
                case 'Info':
                case 'Warn':
                    ons.notification.toast({
                        message: m.content.title+" : "+m.content.description,
                        buttonLabel: 'close',
                        timeout: 3000,
                        force: true,
                    }).catch(()=>{});

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

    nagomeDirectEventHandler(arrM) {
        let st = this.state;
        let chApp = false;

        for (const m of arrM) {
            switch (m.command) {
            case 'App.Version':
                chApp = true;
                st.appVersion = m.content;
                st.appVersionModalIsOpen = true;
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

    renderModal() {
        if (this.state.appVersion == null) {
            return null;
        }
        return (
            <Modal
                isOpen={this.state.appVersionModalIsOpen}
                class="main_modal"
            >
                <section>
                    <img src={process.env.PUBLIC_URL + "favicon.ico"} />
                    <div class="versions_text">
                        <p>
                            <span>
                                {this.state.appVersion.name}
                            </span>
                            <span>
                                {this.state.appVersion.version}
                            </span>
                        </p>
                        <p>
                            <span>
                                {name}
                            </span>
                            <span>
                                v{version}
                            </span>
                        </p>
                    </div>
                    <p>
                        <Button onClick={() => {
                            let st = this.state;
                            st.appVersionModalIsOpen = false;
                            this.setState(st);
                        }}>
                            Close
                        </Button>
                    </p>
                </section>
            </Modal>
        );
    }

    render() {
        if (this.state.broadInfo == null) {
            document.title = "Nagome";
        } else {
            document.title = this.state.broadInfo.title+" / "+this.state.broadInfo.owner_name+" - Nagome";
        }

        return (
            <Page
                renderModal={this.renderModal.bind(this)}
            >
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
