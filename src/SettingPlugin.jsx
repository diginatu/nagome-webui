import React, {Component} from 'react';
import {ngm} from './NagomeConn.js';
import {List, ListItem, Page, Toolbar, BackButton, Input} from 'react-onsenui';

export default class SettingPlugin extends Component {
    constructor() {
        super();
        this.state = {
            plugs: [],
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
                <div className='center'>Plugins</div>
            </Toolbar>
        );
    }

    handleEnable(no, e) {
        let target = e.currentTarget || e.target;
        ngm.pluginEnable(no, target.checked);
    }

    renderRow(row, i) {
        return (
            <ListItem key={i}>
                <div className='left'>
                    <Input
                        type='checkbox'
                        disabled={row.no === 0}
                        checked={row.state === 1}
                        inputId={`checkbox-${row}`}
                        onChange={this.handleEnable.bind(this, row.no)}
                    />
                </div>
                <div className='center'>
                    <div className='list__item__title'>
                        {row.name}
                    </div>
                    <div className='list__item__subtitle'>
                        {row.description}
                    </div>
                </div>
                <div className='right'>
                    button
                </div>
            </ListItem>
        );
    }

    updateList(list) {
        this.setState({
            plugs: list,
        });
    }

    render() {
        return (
            <Page renderToolbar={this.renderToolbar.bind(this)}>
                <List dataSource={this.state.plugs} renderRow={this.renderRow.bind(this)} />
            </Page>
        );
    }
}
