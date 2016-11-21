import React, {Component} from 'react';
//import ons from 'onsenui';
import {Splitter, SplitterSide, SplitterContent, Page, Dialog, ProgressCircular,
    Toolbar, ToolbarButton, Icon} from 'react-onsenui';
//import ons from 'onsenui';

import {ngm, NagomeInit} from './NagomeConn.js';

import Comment from './Comment.jsx';
import Menu from './Menu.jsx';
import BottomCommentBar from './BottomCommentBar.jsx';

let availableThumPer10s = 5;
window.setInterval(()=>{
    availableThumPer10s = 5;
}, 10 * 1000);

export default class App extends Component {
    nagomeEventHandler(arrM) {
        let comment = this.refs.comment;
        let vstate = comment.state;
        for (let i = 0, len = arrM.length; i < len; i++) {
            let m = arrM[i];

            switch (m.domain) {
            case 'nagome_comment':
                if (m.command === "Got") {
                    console.log(m.content.user_thumbnail_url);
                    if (m.content.user_thumbnail_url!==undefined) {
                        console.log(availableThumPer10s);
                        if (availableThumPer10s <= 0) {
                            m.content.user_thumbnail_url = "";
                        } else {
                            availableThumPer10s --;
                            m.content.user_thumbnail_url.replace("usericon/", "usericon/s/");
                        }
                    }
                    m.content.date = m.content.date.split(RegExp('[T.]'))[1];
                    vstate.data.push(m.content);
                } else {
                    console.log(m);
                }
                break;
            case 'nagome_ui':
                switch (m.command) {
                case "ClearComments":
                    vstate = { data: [] };
                    break;
                default:
                    console.log(m);
                }
                break;
            default:
                console.log(m);
            }
        }

        comment.setState(vstate);
    }

    websocketEventHandler(e) {
        console.log(e);

        let t = this.state;
        switch (e) {
        case 'close':
            t.isConnecting = true;
            window.setTimeout(ngm.connectWs.bind(ngm), 5000);
            break;
        case 'err':
            t.isConnecting = true;
            break;
        case 'open':
            t.isConnecting = false;
            break;
        default:
            console.log("Unknown ws event", e);
        }
        this.setState(t);
    }

    constructor() {
        super();
        this.state = {menuIsOpen: false, isConnecting: false};

        NagomeInit(this.nagomeEventHandler.bind(this),
                this.websocketEventHandler.bind(this));
        ngm.connectWs();
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
                        renderToolbar={this.renderToolbar.bind(this)}
                        renderBottomToolbar={()=> <BottomCommentBar /> }>
                        <Dialog isOpen={this.state.isConnecting}
                            isCancelable={false}>
                            <div style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <ProgressCircular style={{"margin": "20px"}} indeterminate />
                                <p>Connecting...</p>
                            </div>
                        </Dialog>
                        <Comment ref="comment" />
                    </Page>
                </SplitterContent>
            </Splitter>
            );
    }
}
