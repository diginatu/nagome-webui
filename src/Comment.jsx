import React, { Component } from 'react';

import WebSocketConn from './WebSocketConn.jsx';
import CommentList from './CommentList.jsx';

//let SAMPLEDATA = [{"no":1,"date":"2016-09-22T23:46:59.632895+09:00","user_id":"394246","user_name":"","raw":"ひるぶりやん","comment":"ひるぶりやん","is_premium":true,"is_broadcaster":false,"is_staff":false,"is_anonymity":false,"score":0},
            //{"no":2,"date":"2016-09-22T23:47:11.416712+09:00","user_id":"1320525","user_name":"","raw":"わこー","comment":"わこー","is_premium":true,"is_broadcaster":false,"is_staff":false,"is_anonymity":false,"score":0},
            //{"no":3,"date":"2016-09-22T23:47:18.274712+09:00","user_id":"xu_htpwNUIVe6AO1sfuzlXQVv9s","user_name":"Broadcaster","raw":"わこわこ","comment":"わこわこ","is_premium":true,"is_broadcaster":true,"is_staff":false,"is_anonymity":true,"score":0}];

export default class Comment extends Component {
    constructor() {
        super();

        this.state = {data: []};
    }

    handleMessageChange(m) {
        this.setState({
            data: this.state.data.concat([m])
        });
    }

    render() {
        return (
            <div className="Comment">
                <WebSocketConn onMessageChange={this.handleMessageChange.bind(this)} />
                <CommentList data={this.state.data} />
            </div>
            );
    }
}

