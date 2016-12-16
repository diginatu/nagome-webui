import React, {Component} from 'react';
import {Page, Toolbar, BackButton} from 'react-onsenui';
import {ngm} from './NagomeConn.js';

export default class SettingPlugin extends Component {
    constructor() {
        super();

        ngm.addNgmEvHandler("nagome_directngm", this.listHandler.bind(this));
    }

    listHandler(arrM) {
        //let st = this.state;
        for (let i = 0, len = arrM.length; i < len; i++) {
            let m = arrM[i];
            switch (m.command) {
            case "Plug.List":
                console.log(m.content.plugins);
                break;
            default:
                console.log(m);
            }
        }
        //this.setState(st);
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
