import React, { Component } from 'react';
import {Page, List, ListItem, Input, Button} from 'react-onsenui';

export default class Menu extends Component {
    hide() {
        this.props.onSelect();
    }

    handleConnect() {
        this.hide();
    }

    render() {
        return (
            <Page>
                <form style={{padding: '10px'}}>
                    <Input
                    float
                    onChange={(event) => { this.setState({text: event.target.value});} }
                    placeholder='Broad ID' />
                    <Button onClick={this.handleConnect.bind(this)}>connect</Button>
                </form>
                <List
                    dataSource={['Profile', 'Followers', 'Settings']}
                    renderRow={(title) => (
                        <ListItem key={title} onClick={this.hide.bind(this)} tappable >
                            {title}
                        </ListItem>
                    )}
                />
            </Page>
            );
    }
}


                    //value={this.state.text}
