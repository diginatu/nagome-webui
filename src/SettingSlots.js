import React, {Component} from 'react';
import {ngm} from './NagomeConn.js';
import ons from 'onsenui';
import {Input, Button, List, ListItem, Page, Toolbar, BackButton, Fab, Icon, Popover} from 'react-onsenui';

export default class SettingSlots extends Component {
    constructor() {
        super();
        this.state = {
            slots: [],
            editi: -1,
            settingListPopN: -1,
            setCurrentN: -1,
        };
        this.clickedNew = false;
        this.changed = false;
    }

    settingListPop(i) {
        let st = this.state;
        st.settingListPopN = i;
        this.setState(st);
    }

    settingListPopTarget() {
        return document.getElementById('setting_list_pop_target') || document.getElementById('main_frame_toolbar_center');
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

    handleNameSelectAll(i) {
        const input = document.getElementById('slot_name_edit_input');
        if (input === null) {
            return;
        }
        input.select();
    }

    handleNameEdit(i) {
        this.changed = true;
        let st = this.state;
        st.editi = i;
        this.setState(st);
    }

    handleNameEnd(i) {
        const input = document.getElementById('slot_name_edit_input');
        if (input === null) {
            return;
        }
        let st = this.state;
        st.editi = -1;

        let s = input.value;
        if (s !== "") {
            st.slots[i].settings_name = s;
        }
        this.setState(st);
    }

    handleNameKey(i, e) {
        if (e.keyCode === 13) {
            this.handleNameEnd(i);
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
        this.settingListPop(i);
    }

    handleSetCurrent(i) {
        this.setCurrentN = i;
        ngm.settingsCurrent();
        this.changed = true;
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
        if (this.setCurrentN !== -1) {
            const i = this.setCurrentN;
            let st = this.state;
            const nm = st.slots[i].settings_name;
            st.slots[i] = c;
            st.slots[i].settings_name = nm;
            this.setState(st);
            this.setCurrentN = -1;
        }
    }

    renderRow(row, i) {
        return (
            <ListItem
                key={i}
                tappable
                id={i === this.state.settingListPopN ? "setting_list_pop_target" : ""}
            >
                <div className='left'>
                </div>
                <div
                    className='center'
                    onClick={this.handleItemSelect.bind(this,i)}
                >
                    <span>
                        {row.settings_name}
                    </span>
                </div>
                <div className='right'>
                    <Button
                        onClick={this.handleApply.bind(this, i)}
                        modifier='outline'>
                        Apply
                    </Button>
                </div>
            </ListItem>
        );
    }

    renderSettingListPopver() {
        const i = this.state.settingListPopN;
        if (i === -1) {
            return <div></div>;
        }
        return (
            <div>
                <div className='content'>
                    {(() => {
                        if (this.state.editi !== i) {
                            return(
                                <div className='head'>
                                    <span onDoubleClick={this.handleNameEdit.bind(this,i)}>
                                        {this.state.slots[i].settings_name}
                                    </span>
                                    <Button
                                        onClick={this.handleNameEdit.bind(this,i)}
                                        modifier='quiet'>
                                        Edit
                                    </Button>
                                </div>
                            );
                        } else {
                            return (
                                <div className='head'>
                                    <Input
                                        inputId="slot_name_edit_input"
                                        value={this.state.slots[i].settings_name}
                                        onBlur={this.handleNameEnd.bind(this,i)}
                                        onKeyDown={this.handleNameKey.bind(this,i)}
                                        onFocus={this.handleNameSelectAll.bind(this)}
                                        autofocus
                                    >
                                    </Input>
                                </div>
                            );
                        }
                    })()}
                    <div className='sub'>
                    </div>
                    <Button
                        onClick={this.handleSetCurrent.bind(this, i)}
                        style={{
                            marginRight: "10px"
                        }} >
                        Set Current
                    </Button>
                    <Button
                        onClick={this.handleDelete.bind(this, i)}
                        style={{
                            marginRight: "10px"
                        }}
                        modifier='danger'>
                        Delete
                    </Button>
                </div>
            </div>
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
                <Popover
                    className='setting_list_pop'
                    isOpen={this.state.settingListPopN !== -1}
                    onHide={(() => {
                        this.handleNameEnd.bind(this, this.state.editi)();
                        this.settingListPop.bind(this, -1)();
                    })}
                    onCancel={(() => {
                        this.handleNameEnd.bind(this, this.state.editi)();
                        this.settingListPop.bind(this, -1)();
                    })}
                    getTarget={this.settingListPopTarget.bind(this)}
                    direction='up down'
                >
                    {this.renderSettingListPopver()}
                </Popover>
            </Page>
        );
    }
}
