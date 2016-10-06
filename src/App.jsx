import React, {Component} from 'react';
//import ons from 'onsenui';
import {Splitter, SplitterSide, SplitterContent, Page, Dialog, ProgressCircular,
    Toolbar, ToolbarButton, Icon} from 'react-onsenui';
//import ons from 'onsenui';

import {ngm, NagomeInit} from './NagomeConn.js';

import Comment from './Comment.jsx';
import Menu from './Menu.jsx';
import BottomCommentBar from './BottomCommentBar.jsx';

export default class App extends Component {
    nagomeEventHandler(m) {
        let comment = this.refs.comment;

        switch (m.domain) {
        case 'nagome_comment':
            if (m.command === "Got") {
                comment.setState({
                    data: comment.state.data.concat([m.content])
                });
            }
            break;
        case 'nagome_ui':
            switch (m.command) {
            case "ClearComments":
                comment.setState({ data: [] });
                break;
            default:
                console.log(m);
            }
            break;
        default:
            console.log(m);
        }
    }

    websocketEventHandler(e) {
        console.log(e);

        let t = this.state;
        switch (e) {
        case 'close':
            t.isConnecting = true;
            window.setTimeout(ngm.connectWs.bind(ngm), 3000);
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
                        <Dialog isOpen={this.state.isConnecting} >
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
