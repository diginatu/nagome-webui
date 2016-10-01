import React, { Component } from 'react';

import CommentList from './CommentList.jsx';

export default class Comment extends Component {
    constructor() {
        super();

        this.state = {data: []};
    }

    render() {
        return (
            <div className="Comment">
                <CommentList data={this.state.data} />
            </div>
            );
    }
}

