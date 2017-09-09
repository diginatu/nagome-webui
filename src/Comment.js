import React, { Component } from 'react';

import {ngm} from './NagomeConn.js';

import CommentList from './CommentList.js';
import DropArea from './DropArea.js';

export default class Comment extends Component {
    constructor() {
        super();
        this.state = {
            data: [
//{"no":70,"date":"20:08:58","raw":"おつ","comment":"おつ","is_premium":true,"is_broadcaster":false,"is_staff":false,"is_anonymity":false,"score":0,"user_id":"11246304","user_name":"デジネイ","user_thumbnail_url":"http://usericon.nimg.jp/usericon/1124/11246304.jpg"},
//{"no":71,"date":"20:09:17","raw":"anony","comment":"anony","is_premium":true,"is_broadcaster":false,"is_staff":false,"is_anonymity":true,"score":0,"user_id":"TnPRtKVgHdYW4Uklky8yjLn982Y","user_name":""},
//{"no":72,"date":"20:09:17","raw":"/disconnect","comment":"/disconnect","is_premium":true,"is_broadcaster":true,"is_staff":false,"is_anonymity":true,"score":0,"user_id":"TnPRtKVgHdYW4Uklky8yjLn982Y","user_name":"Broadcaster"}
            ],
        };

        ngm.addNgmEvHandler("nagome_ui", this.ngmEvUIHandler.bind(this));
        ngm.addNgmEvHandler("nagome_comment", this.ngmEvCommentHandler.bind(this));
    }

    ngmEvUIHandler(arrM) {
        let st = this.state;
        for (const m of arrM) {
            switch (m.command) {
            case "ClearComments":
                st = { data: [] };
                break;
            case "Dialog":
                break;
            default:
                console.log(m);
            }
        }
        this.setState(st);
    }

    ngmEvCommentHandler(arrM) {
        let st = this.state;
        for (const m of arrM) {
            if (m.command === "Got") {
                m.content.date = m.content.date.split(RegExp('[T.]'))[1];
                st.data.push(m.content);
            } else {
                console.log(m);
            }
        }
        this.setState(st);
    }

    handleDrop(e) {
        e.preventDefault(); // stop moving page
        const text = e.dataTransfer.getData('Text');
        ngm.broadConnect(text);
        return false;
    }

    render() {
        return (
            <div className="comment fill_parent"
                onDrop={this.handleDrop.bind(this)} >
                <CommentList data={this.state.data} />
                { !this.props.isBroadOpen && this.state.data.length === 0 ? <DropArea /> : null }
            </div>
        );
    }
}

