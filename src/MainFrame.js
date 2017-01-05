import React, {Component} from 'react';
import {Page, Dialog, ProgressCircular, Toolbar, ToolbarButton, Icon} from 'react-onsenui';
import ons from 'onsenui';

import Comment from './Comment.js';
import BottomCommentBar from './BottomCommentBar.js';

export default class MainFrame extends Component {
    constructor() {
        super();
        this.state = {
            isPortrait: true,
        };
        ons.orientation.on("change", (e) => {
            if (this.state.isPortrait !== e.isPortrait) {
                this.setState({
                    isPortrait: e.isPortrait,
                });
            }
        });
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
                <div className='center'>{this.props.broadTitle}</div>
            </Toolbar>
        );
    }

    render() {
        return (
            <Page
                id="mainFrame"
                renderToolbar={this.renderToolbar.bind(this)}
                renderBottomToolbar={()=> <BottomCommentBar /> }>
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
                <Comment isBroadOpen={this.props.isBroadOpen} />
            </Page>
        );
    }
}
