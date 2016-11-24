import React, {Component} from 'react';
import {Splitter, SplitterSide, SplitterContent, Page, Dialog, ProgressCircular,
    Toolbar, ToolbarButton, Icon} from 'react-onsenui';
import ons from 'onsenui';

import {ngm, NagomeInit} from './NagomeConn.js';

import Comment from './Comment.jsx';
import Menu from './Menu.jsx';
import BottomCommentBar from './BottomCommentBar.jsx';

let availableThumPer10s = 5;
window.setInterval(()=>{
    availableThumPer10s = 5;
}, 10 * 1000);

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            menuIsOpen: false,
            wsIsConnecting: false,
            broad: {
                open: false,
            },
        };

        NagomeInit(this.nagomeEventHandler.bind(this),
                this.websocketEventHandler.bind(this));
        ngm.connectWs();
    }

    nagomeEventHandler(arrM) {
        let comment = this.refs.comment;
        let stApp = this.state;
        let stComment = comment.state;
        for (let i = 0, len = arrM.length; i < len; i++) {
            let m = arrM[i];

            switch (m.domain) {
            case 'nagome':
                switch (m.command) {
                case 'Broad.Open':
                    stApp.broad.open = true;
                    break;
                case 'Broad.Close':
                    stApp.broad.open = false;
                    break;
                default:
                    console.log(m);
                }
                break;
            case 'nagome_comment':
                if (m.command === "Got") {
                    if (m.content.user_thumbnail_url!==undefined) {
                        if (availableThumPer10s <= 0) {
                            m.content.user_thumbnail_url = "";
                        } else {
                            availableThumPer10s --;
                            m.content.user_thumbnail_url.replace("usericon/", "usericon/s/");
                        }
                    }
                    m.content.date = m.content.date.split(RegExp('[T.]'))[1];
                    stComment.data.push(m.content);
                } else {
                    console.log(m);
                }
                break;
            case 'nagome_ui':
                switch (m.command) {
                case "ClearComments":
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
            default:
                console.log(m);
            }
        }

        this.setState(stApp);
        comment.setState(stComment);
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

    renderToolbar() {
        return (
            <Toolbar>
                <div className='left'>
                    <ToolbarButton onClick={this.setMenu.bind(this, true)}>
                        <Icon icon='ion-navicon, material:md-menu' />
                    </ToolbarButton>
                </div>
                <div className='center'>Nagome</div>
            </Toolbar>
            );
    }

    render() {
        return (
            <Splitter>
                <SplitterSide
                    side='left'
                    width={200}
                    collapse={true}
                    isSwipeable={true}
                    isOpen={this.state.menuIsOpen}
                    onClose={this.setMenu.bind(this, false)}
                    onOpen={this.setMenu.bind(this, true)}
                    >
                    <Menu onSelect={this.setMenu.bind(this, false)} />
                </SplitterSide>
                <SplitterContent>
                    <Page
                        id="mainPage"
                        renderToolbar={this.renderToolbar.bind(this)}
                        renderBottomToolbar={()=> <BottomCommentBar /> }>
                        <Dialog isOpen={this.state.wsIsConnecting}
                            isCancelable={false}>
                            <div style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <ProgressCircular style={{"margin": "20px"}} indeterminate />
                                <p>Connecting...</p>
                            </div>
                        </Dialog>
                        <Comment 
                            broadState={this.state.broad}
                            ref="comment" />
                    </Page>
                </SplitterContent>
            </Splitter>
            );
    }
}
