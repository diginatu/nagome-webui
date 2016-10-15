import React, { Component } from 'react';

import {ngm} from './NagomeConn.js';

import CommentList from './CommentList.jsx';
import DropArea from './DropArea.jsx';

export default class Comment extends Component {
    constructor() {
        super();
        this.state = {data: []};
    }

    handleDrop(e) {
        e.preventDefault(); // stop moving page
        var text = e.dataTransfer.getData('Text');
        ngm.broadConnect(text);
        return false;
    }

    render() {
        return (
            <div className="Comment"
                onDrop={this.handleDrop.bind(this)}
                style={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection:"column",
                    overflow: "auto",
                }}>
                <CommentList data={this.state.data} />
                { this.state.data.length === 0 ? <DropArea /> : null }
            </div>
            );
    }
}

