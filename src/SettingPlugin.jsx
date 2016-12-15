import React, {Component} from 'react';
import {Page, Toolbar, BackButton} from 'react-onsenui';

export default class SettingPlugin extends Component {
    back() {
        this.props.navigator.popPage();
    }

    renderToolbar() {
        return (
            <Toolbar>
                <div className='left'>
                    <BackButton onClick={this.back.bind(this)}>
                        Back
                    </BackButton>
                </div>
                <div className='center'>Plugins</div>
            </Toolbar>
        );
    }

    render() {
        return (
            <Page
                renderToolbar={this.renderToolbar.bind(this)} >
                kepekepe
            </Page>
        );
    }
}
