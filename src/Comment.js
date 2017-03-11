import React, { Component } from 'react';
import {Popover} from 'react-onsenui';

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
            commentInfoPopN: -1,
        };

        ngm.addNgmEvHandler("nagome_comment", this.commentHandler.bind(this));
        ngm.addNgmEvHandler("nagome_ui", this.clearCommentsHandler.bind(this));
    }

    openCommentInfoPop(n) {
        let st = this.state;
        st.commentInfoPopN = n;
        this.setState(st);
    }

    commentInfoTarget() {
        return document.getElementById('comment_info_pop_target') || document.getElementById('main_frame_toolbar_center');
    }

    renderCommentInfoPopover() {
        if (this.state.commentInfoPopN === -1 ||
            this.state.commentInfoPopN > this.state.data.length) {
            return (
                <div className='content'>
                    No comment is selected
                </div>
            );
        }
        const data = this.state.data[this.state.commentInfoPopN];
        return (
            <div>
                <div className='content'>
                    <div className='head'>
                        {data.user_name}
                    </div>
                    <div className='sub'>
                        {(() => {
                            if (data.is_anonymity ||
                                data.is_broadcaster) {
                                return data.user_id;
                            } else {
                                return (
                                    <a href={'http://www.nicovideo.jp/user/'+data.user_id}>
                                        {data.user_id}
                                    </a>
                                );
                            }
                        })() }
                    </div>
                </div>
                <div className='extra content'>
                    <div className='sub'>
                        No. {data.no} / {data.date}
                    </div>
                    <div className='body'>
                        {data.comment}
                    </div>
                </div>
            </div>
        );
    }

    clearCommentsHandler(arrM) {
        let st = this.state;
        for (let i = 0, len = arrM.length; i < len; i++) {
            const m = arrM[i];
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

    commentHandler(arrM) {
        let st = this.state;
        for (let i = 0, len = arrM.length; i < len; i++) {
            const m = arrM[i];
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
        var text = e.dataTransfer.getData('Text');
        ngm.broadConnect(text);
        return false;
    }

    render() {
        return (
            <div className="comment fill_parent"
                onDrop={this.handleDrop.bind(this)} >
                <CommentList
                    data={this.state.data}
                    onCommentInfoPop={this.openCommentInfoPop.bind(this)}
                    commentInfoPopN={this.state.commentInfoPopN}
                />
                { !this.props.isBroadOpen && this.state.data.length === 0 ? <DropArea /> : null }

                <Popover
                    className='comment_info_pop'
                    isOpen={this.state.commentInfoPopN !== -1}
                    onHide={this.openCommentInfoPop.bind(this, -1)}
                    onCancel={this.openCommentInfoPop.bind(this, -1)}
                    getTarget={this.commentInfoTarget.bind(this)}
                >
                    {this.renderCommentInfoPopover()}
                </Popover>
            </div>
        );
    }
}

