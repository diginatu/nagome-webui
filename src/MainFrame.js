import React, {Component} from 'react';
import {Popover, Page, Dialog, ProgressCircular, Toolbar, ToolbarButton, Icon} from 'react-onsenui';
import ons from 'onsenui';

import {ngm} from './NagomeConn.js';
import Utils from './Utils.js';
import Comment from './Comment.js';
import BottomCommentBar from './BottomCommentBar.js';

export default class MainFrame extends Component {
    constructor() {
        super();
        this.state = {
            isPortrait: true,
            isBroadInfoPop: false,
            broadCounts: {
                comment_count: "-",
                watch_count: "-",
            },
        };
        ons.orientation.on("change", (e) => {
            if (this.state.isPortrait !== e.isPortrait) {
                this.setState({
                    isPortrait: e.isPortrait,
                });
            }
        });

        ngm.addNgmEvHandler("nagome", this.nagomeEventHandler.bind(this));
    }

    nagomeEventHandler(arrM) {
        let st = this.state;
        let chApp = false;

        for (const m of arrM) {
            switch (m.command) {
            case 'Broad.Info':
                chApp = true;
                st.broadCounts = m.content;
                break;
            case 'Broad.Close':
                chApp = true;
                st.broadCounts.comment_count = "-";
                st.broadCounts.watch_count = "-";
                break;
            default:
            }
        }

        if (chApp) this.setState(st);
    }

    openBroadInfoPop(open) {
        let st = this.state;
        st.isBroadInfoPop = open;
        this.setState(st);
    }

    broadTitleTarget() {
        return document.getElementById('main_frame_toolbar_center');
    }

    renderToolbar() {
        return (
            <Toolbar id="main_toolbar">
                <div className='left'>
                    <ToolbarButton
                        onClick={this.props.onMenuOpen}
                        style={{
                            visibility: ons.orientation.isPortrait()?"":"hidden",
                        }}
                    >
                        <Icon icon='md-menu' />
                    </ToolbarButton>
                </div>
                <div
                    className='center'
                    onClick={this.openBroadInfoPop.bind(this, true)}>
                    <div id='main_frame_toolbar_center'>
                        {this.props.broadInfo == null ? "Nagome" : this.props.broadInfo.title}
                    </div>
                </div>
                <div className='right'>
                    <p>
                        <Icon icon='md-account' className="right_count_icon" />
                        {this.state.broadCounts.watch_count}
                    </p>
                    <p>
                        <Icon icon='md-comment' className="right_count_icon" />
                        {this.state.broadCounts.comment_count}
                    </p>
                </div>
            </Toolbar>
        );
    }

    renderBroadInfoPopover() {
        const bi = this.props.broadInfo;
        if (bi == null) {
            return (
                <div className='content'>
                    <p>
                        The broadcast information is shown here.
                    </p>
                </div>
            );
        } else {
            return (
                <div className='content'>
                    <div className='head'>
                        <a href={Utils.broadcastURL(bi.broad_id)}>{bi.title}</a>
                    </div>
                    <div className='body'>
                        <a href={Utils.communityURL(bi.community_id)}>{bi.community_id}</a> / 
                        <a href={Utils.userURL(bi.owner_id)}>{bi.owner_name}</a>
                        <p className="desc">
                            {bi.description}
                        </p>
                    </div>
                </div>
            );
        }

    }

    render() {
        return (
            <Page
                id="mainFrame"
                renderToolbar={this.renderToolbar.bind(this)}
                renderBottomToolbar={()=> <BottomCommentBar /> }>

                <Comment
                    isBroadOpen={this.props.isBroadOpen}
                />

                <Popover
                    className='broad_info_pop'
                    isOpen={this.state.isBroadInfoPop}
                    onHide={this.openBroadInfoPop.bind(this, false)}
                    onCancel={this.openBroadInfoPop.bind(this, false)}
                    getTarget={this.broadTitleTarget.bind(this)}
                >
                    {this.renderBroadInfoPopover()}
                </Popover>

                <Dialog
                    isOpen={this.props.isWsConnecting}
                    isCancelable={false} >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "9px",
                    }}>
                        <ProgressCircular style={{"margin": "20px"}} indeterminate />
                        <p>Connecting...</p>
                    </div>
                </Dialog>
            </Page>
        );
    }
}
