import React, {Component} from 'react';
import {Page, Toolbar, BackButton, Input, Button} from 'react-onsenui';
import {ngm} from './NagomeConn.js';

export default class SettingAccount extends Component {
    constructor() {
        super();
        this.state = {
            mail: "",
            pass: "",
        };
    }

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
                <div className='center'>Account Setting</div>
            </Toolbar>
        );
    }

    handleMailChange(e) {
        let st = this.state;
        st.mail = e.target.value;
        this.setState(st);
    }

    handlePassChange(e) {
        let st = this.state;
        st.pass = e.target.value;
        this.setState(st);
    }

    handleSignIn() {
        if (this.state.mail || this.state.pass) {
            ngm.accountSet({
                mail: this.state.mail,
                pass: this.state.pass,
            });
        }
        ngm.accountLogin();
        ngm.accountSave();
    }

    render() {
        return (
            <Page
                renderToolbar={this.renderToolbar.bind(this)} >
                <section className="account_form">
                    <p>
                        <Input
                            modifier='underbar'
                            ref="mail"
                            float
                            onChange={this.handleMailChange.bind(this)}
                            placeholder='Email' />
                    </p>
                    <p>
                        <Input
                            modifier='underbar'
                            type='password'
                            ref="pass"
                            float
                            onChange={this.handlePassChange.bind(this)}
                            placeholder='Password' />
                    </p>
                    <p>
                        <Button onClick={this.handleSignIn.bind(this)}>
                            {(this.state.mail || this.state.pass) ? "Update and Sign in" : "Re-login"}
                        </Button>
                    </p>
                </section>
            </Page>
        );
    }
}
