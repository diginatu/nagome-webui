import React, { Component } from 'react';
//import ons from 'onsenui';
import {Splitter, SplitterSide, SplitterContent, Page,
    Toolbar, ToolbarButton, Icon} from 'react-onsenui';

import Ngmcon, {ngm} from './NagomeConn.js';

import Comment from './Comment.jsx';
import Menu from './Menu.jsx';

export default class App extends Component {
    nagomeEventHandler(type, con) {
        switch (type) {
        case Ngmcon.EventType.comment:
            console.log(con);
            let comment = this.refs.comment;
            comment.setState({
                data: comment.state.data.concat([con])
            });
            break;
        default:
            console.log("unknown event", con);
        }
    }

    constructor() {
        super();
        this.state = {isOpen: false};

        Ngmcon.Init(this.nagomeEventHandler.bind(this));
        ngm.connectWs();
    }

    hideMenu() {
        this.setState({isOpen: false});
    }

    showMenu() {
        this.setState({isOpen: true});
    }

    renderToolbar() {
        return (
            <Toolbar>
                <div className='left'>
                    <ToolbarButton onClick={this.showMenu.bind(this)}>
                        <Icon icon='ion-navicon, material:md-menu' />
                    </ToolbarButton>
                </div>
                <div className='center'>Side menu</div>
            </Toolbar>
            );
    }

    render() {
        return (
            <Splitter>
                <SplitterSide
                    style={{
                        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                    }}
                    side='left'
                    width={200}
                    collapse={true}
                    isSwipeable={true}
                    isOpen={this.state.isOpen}
                    onClose={this.hideMenu.bind(this)}
                    onOpen={this.showMenu.bind(this)}
                    >
                    <Menu onSelect={this.hideMenu.bind(this)} />
                </SplitterSide>
                <SplitterContent>
                    <Page renderToolbar={this.renderToolbar.bind(this)}>
                        <Comment ref="comment" />
                    </Page>
                </SplitterContent>
            </Splitter>
            );
    }
}

//<WebSocketConn />
