import React, {Component} from 'react';
import {ngm} from './NagomeConn.js';
import ons from 'onsenui';
import {Input, Button, List, ListItem, Page, Toolbar, BackButton, Fab, Icon} from 'react-onsenui';

export default class SettingSlots extends Component {
    constructor() {
        super();
        this.state = {
            slots: [],
            editi: -1,
            selecti: -1,
        };
        this.clickedNew = false;
        this.changed = false;
    }

    back() {
        if (this.changed) {
            ons.notification.confirm({
                title: 'Save Slots',
                message: `Are you sure you want to save slots setting?`,
                callback: (d) => {
                    if (d === 1) {
                        ngm.settingsSetAll({
                            Config: this.state.slots
                        });
                    }
                    this.props.navigator.popPage();
                }
            });
        } else {
            this.props.navigator.popPage();
        }
    }

    renderToolbar() {
        return (
            <Toolbar>
                <div className='left'>
                    <BackButton onClick={this.back.bind(this)}>
                        Back
                    </BackButton>
                </div>
                <div className='center'>Setting Slots</div>
            </Toolbar>
        );
    }

    handleClickNew() {
        this.changed = true;
        ngm.settingsCurrent();
        this.clickedNew = true;
    }

    handleNameEdit(i) {
        this.changed = true;
        let st = this.state;
        st.editi = i;
        this.setState(st);
    }

    handleNameEnd(i, e) {
        let st = this.state;
        st.editi = -1;

        let s = e.target.value;
        if (s !== "") {
            st.slots[i].settings_name = s;
        }
        this.setState(st);
    }

    handleNameKey(i, e) {
        if (e.keyCode === 13) {
            this.handleNameEnd(i, e);
        }
    }

    handleApply(i) {
        ngm.settingsSetCurrent(this.state.slots[i]);
        this.back();
    }

    handleDelete(i) {
        this.changed = true;
        let st = this.state;
        st.slots.splice(i, 1);
        this.setState(st);
    }

    handleItemSelect(i) {
        let st = this.state;
        st.selecti = i;
        this.setState(st);
    }

    update(list) {
        this.setState({
            slots: list,
        });
    }

    updateCurrent(c) {
        if (this.clickedNew) {
            let st = this.state;
            c.settings_name = "New Current Setting";
            st.slots.push(c);
            this.setState(st);
            this.clickedNew = false;
        }
    }

    renderRow(row, i) {
        const selected = this.state.selecti === i;
        return (
            <ListItem
                key={i}
                onClick={this.handleItemSelect.bind(this, i)}
                className={(selected?"selected ":"") + "slot_list_item"}
                tappable
            >
                <div className='left'>
                </div>
                {(() => {
                    if (this.state.editi === i) {
                        return (
                            <div className='center'>
                                <Input
                                    value={row.settings_name}
                                    onBlur={this.handleNameEnd.bind(this,i)}
                                    onKeyDown={this.handleNameKey.bind(this,i)} >
                                </Input>
                            </div>
                        );
                    } else {
                        return(
                            <div className='center'>
                                <span onDoubleClick={this.handleNameEdit.bind(this,i)}>
                                    {row.settings_name}
                                </span>
                                { selected ?
                                    <Button
                                        onClick={this.handleNameEdit.bind(this,i)}
                                        modifier='quiet'>
                                        Edit
                                    </Button>
                                : null }
                            </div>
                        );
                    }
                })()}
                <div className='right'>
                    { selected ?
                        <Button
                            onClick={this.handleDelete.bind(this, i)}
                            style={{
                                marginRight: "10px"
                            }}
                            modifier='danger'>
                            Delete
                        </Button>
                    : null }
                    <Button
                        onClick={this.handleApply.bind(this, i)}
                        modifier='outline'>
                        Apply
                    </Button>
                </div>
            </ListItem>
        );
    }

    render() {
        return (
            <Page renderToolbar={this.renderToolbar.bind(this)} >
                <div className="fill_parent" >
                    <List dataSource={this.state.slots} renderRow={this.renderRow.bind(this)} />
                    <Fab
                        style={{
                            backgroundColor: ons.platform.isAndroid()?null:'#4282cc'
                        }}
                        onClick={this.handleClickNew.bind(this)}
                        position='bottom right'>
                        <Icon icon='md-plus' />
                    </Fab>
                    <div className="fill" onClick={this.handleItemSelect.bind(this, -1)}>
                    </div>
                </div>
            </Page>
        );
    }
}
