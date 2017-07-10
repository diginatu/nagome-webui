import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ngm} from './NagomeConn.js';
import {Page, Toolbar, BackButton, Checkbox} from 'react-onsenui';

export default class Settings extends Component {
    constructor() {
        super();
        this.state = {
            settings: {},
        };
    }

    back() {
        let st = this.state.settings;
        st.auto_follow_next_waku = ReactDOM.findDOMNode(this.refs.auto_follow_next_waku).checked;
        st.auto_save_to0_slot = ReactDOM.findDOMNode(this.refs.auto_save_to0_slot).checked;
        st.user_name_get = ReactDOM.findDOMNode(this.refs.user_name_get).checked;
        st.owner_comment = ReactDOM.findDOMNode(this.refs.owner_comment).checked;
        ngm.settingsSetCurrent(st);

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
                <div className='center'>Settings</div>
            </Toolbar>
        );
    }

    update(s) {
        this.setState({
            settings: s,
        });
    }

    render() {
        return (
            <Page renderToolbar={this.renderToolbar.bind(this)}>
                <p className='form_p'>
                    <label>
                        <Checkbox
                            checked={this.state.settings.auto_follow_next_waku}
                            ref="auto_follow_next_waku"
                        />
                        Auto follow to the new broadcast of same community (Tsugi Waku)
                    </label>
                </p>
                <p className='form_p'>
                    <label>
                        <Checkbox
                            checked={this.state.settings.auto_save_to0_slot}
                            ref="auto_save_to0_slot"
                        />
                        Auto save to slot 0
                    </label>
                </p>
                <p className='form_p'>
                    <label>
                        <Checkbox
                            checked={this.state.settings.user_name_get}
                            ref="user_name_get"
                        />
                        Auto getting user name
                    </label>
                </p>
                <p className='form_p'>
                    <label>
                        <Checkbox
                            checked={this.state.settings.owner_comment}
                            ref="owner_comment"
                        />
                        Comment as an owner if the broadcast is yours
                    </label>
                </p>
            </Page>
        );
    }
}
