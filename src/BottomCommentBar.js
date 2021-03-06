import React, { Component } from 'react';
import {Input, BottomToolbar, Button} from 'react-onsenui';

import {ngm} from './NagomeConn.js';

const initialStatus = {text: ""};

export default class App extends Component {
    constructor() {
        super();
        this.state = initialStatus;
    }

    sendComment() {
        ngm.sendComment(this.state.text);
        this.setState(initialStatus);
    }

    render() {
        return (
            <BottomToolbar>
                <div style={{
                    display:    'flex',
                    height:     '100%',
                    alignItems: 'center'}}>
                    <Input
                        className='bottom_toolbar_input'
                        value={this.state.text}
                        float
                        onChange={(event) => { this.setState({text: event.target.value});} }
                        onKeyPress={(event) => {
                            const code = event.keyCode || event.which;
                            if (code === 13) {
                                this.sendComment();
                            }
                        }}
                        placeholder='Input message'
                    />
                    <Button modifier='quiet' onClick={this.sendComment.bind(this)}>
                        Send
                    </Button>
                </div>
            </BottomToolbar>
        );
    }
}

