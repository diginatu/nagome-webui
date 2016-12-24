import React, {Component} from 'react';
import ReactDOM from 'react-dom';
//import {ngm} from './NagomeConn.js';
import {Page, Toolbar, BackButton, Input} from 'react-onsenui';

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
        st.auto_follow_next_waku = ReactDOM.findDOMNode(this.refs.auto_follow_next_waku).checked;
        console.log(st);
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
                        <Input
                            checked={this.state.settings.auto_follow_next_waku}
                            ref="auto_follow_next_waku"
                            type='checkbox'
                        />
                        Auto follow to next Waku (live broad)
                    </label>
                </p>
                <p className='form_p'>
                    <label>
                        <Input
                            checked={this.state.settings.auto_save_to0_slot}
                            ref="auto_save_to0_slot"
                            type='checkbox'
                        />
                        Auto save to slot 0
                    </label>
                </p>
                <p className='form_p'>
                    <label>
                        <Input
                            checked={this.state.settings.user_name_get}
                            ref="user_name_get"
                            type='checkbox'
                        />
                        Auto getting user name
                    </label>
                </p>
            </Page>
        );
    }
}
