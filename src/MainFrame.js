import React, {Component} from 'react';
import {Popover, Page, Dialog, ProgressCircular, Toolbar, ToolbarButton, Icon} from 'react-onsenui';
import ons from 'onsenui';

import Comment from './Comment.js';
import BottomCommentBar from './BottomCommentBar.js';

export default class MainFrame extends Component {
    constructor() {
        super();
        this.state = {
            isPortrait: true,
            isBroadInfoPop: false,
        };
        ons.orientation.on("change", (e) => {
            if (this.state.isPortrait !== e.isPortrait) {
                this.setState({
                    isPortrait: e.isPortrait,
                });
            }
        });
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
            <Toolbar>
                <div className='left'>
                    <ToolbarButton
                        onClick={this.props.onMenuOpen}
                        style={{
                            visibility: ons.orientation.isPortrait()?"":"hidden",
                        }}
                    >
                        <Icon icon='ion-navicon, material:md-menu' />
                    </ToolbarButton>
                </div>
                <div
                    className='center'
                    id='main_frame_toolbar_center'
                    onClick={this.openBroadInfoPop.bind(this, true)}>
                    {this.props.broadInfo === null ? "Nagome" : this.props.broadInfo.title}
                </div>
            </Toolbar>
        );
    }

    renderBroadInfoPopover() {
        if (this.props.broadInfo === null) {
            return (
                <section>
                    <p>
                        Broadcast information shown here.
                    </p>
                </section>
            );
        } else {
            const bi = this.props.broadInfo;
            return (
                <section>
                    <h3>
                        <a href={"http://live.nicovideo.jp/watch/" + bi.broad_id}>{bi.title}</a>
                    </h3>
                    <p>
                        <a href={"http://com.nicovideo.jp/community/" + bi.community_id}>{bi.community_id}</a> / 
                        <a href={"http://www.nicovideo.jp/user/" + bi.owner_id}>{bi.owner_name}</a>
                    </p>
                    <p>{bi.description}</p>
                </section>
            );
        }

    }

    render() {
        return (
            <Page
                id="mainFrame"
                renderToolbar={this.renderToolbar.bind(this)}
                renderBottomToolbar={()=> <BottomCommentBar /> }>

                <Comment isBroadOpen={this.props.isBroadOpen} />

                <Popover
                    className='broad_info_pop'
                    isOpen={this.state.isBroadInfoPop}
                    onOpen={this.openBroadInfoPop.bind(this, true)}
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
