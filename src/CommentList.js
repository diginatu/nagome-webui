import React, { Component } from 'react';
import {Popover, List, ListItem, ListHeader, Button} from 'react-onsenui';
import ons from 'onsenui';
import Utils from './Utils';
import {ngm} from './NagomeConn.js';

export default class CommentList extends Component {
    constructor() {
        super();
        this.isBottom = true;
        this.userArtSeed = 0;
        this.state = {
            commentInfoPopN: -1,
        };
    }

    editUserName(id) {
        this.openCommentInfoPop(-1);
        ons.notification.prompt({
            title: 'Edit User Name',
            message: 'Input new user name',
            cancelable: true,
            callback: (nm) => {
                ngm.userSetName(id, nm);
            },
        }).catch(()=>{});
    }

    fetchUserName(id) {
        this.openCommentInfoPop(-1);
        ons.notification.confirm({
            title: 'Fetch User Name',
            message: `Are you sure you want to fetch the user name and overwrite?`,
            callback: (d) => {
                if (d === 1) {
                    ngm.userFetch(id);
                }
            }
        });
    }

    deleteUserName(id) {
        this.openCommentInfoPop(-1);
        ons.notification.confirm({
            title: 'Delete User',
            message: `Are you sure you want to delete the user?`,
            callback: (d) => {
                if (d === 1) {
                    ngm.userDelete(id);
                }
            }
        });
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
            this.state.commentInfoPopN > this.props.data.length) {
            return (
                <div className='content'>
                    No comment is selected
                </div>
            );
        }
        const data = this.props.data[this.state.commentInfoPopN];
        return (
            <div>
                <div className='content'>
                    <div className='right'>
                        { data.user_thumbnail_url == null ?
                                this.renderUserArt(data.user_id) :
                                <img
                                    src={data.user_thumbnail_url.replace("/usericon/", "/usericon/s/")}
                                    alt="user icon"
                                    className="user_img"
                                >
                                </img> }
                    </div>
                    <div className='head'>
                        {data.user_name || "???"}
                    </div>
                    <div className='sub'>
                        { (data.is_anonymity || data.is_broadcaster) ?
                                data.user_id :
                                <a href={Utils.userURL(data.user_id)}>
                                    {data.user_id}
                                </a> }
                    </div>
                    <Button
                        modifier='outline'
                        onClick={this.editUserName.bind(this, data.user_id)}
                    >
                        Edit
                    </Button>
                    <Button
                        modifier='outline'
                        disabled={data.is_anonymity || data.is_broadcaster}
                        onClick={this.fetchUserName.bind(this, data.user_id)}
                    >
                        Fetch
                    </Button>
                    <Button
                        modifier='danger outline'
                        onClick={this.deleteUserName.bind(this, data.user_id)}
                    >
                        Delete
                    </Button>
                </div>
                <div className='extra content'>
                    <div className='right sub'>
                        {data.date}
                    </div>
                    <div className='sub'>
                        No. {data.no}
                    </div>
                    <div className='body'>
                        {data.comment}
                    </div>
                </div>
            </div>
        );
    }

    djb2_hash(str) {
        let hash = 5381;
        for (var i = 0, len = str.length; i < len; i++) {
            // '|0' converts into 32-bit int
            hash = (((hash << 5) + hash) + str.charCodeAt(i))|0;
        }
        this.userArtSeed = hash;
        return hash;
    }

    lcg_random(seed = this.userArtSeed) {
        const a = 22695477;
        const c = 1;
        const rand = (seed * a + c)|0;
        this.userArtSeed = rand;
        return rand; // '|0' converts into 32-bit int
    }

    random_color() {
        const r = this.lcg_random() >>> 2;
        const colnm = '#' + ('000000' + r.toString(16)).slice(-6);
        return colnm;
    }

    renderUserArt(hash) {
        this.djb2_hash(hash);
        return (
            <table className='user_art'>
                <tbody>
                    <tr>
                        <td style={{backgroundColor: this.random_color()}}></td>
                        <td style={{backgroundColor: this.random_color()}}></td>
                    </tr>
                    <tr>
                        <td style={{backgroundColor: this.random_color()}}></td>
                        <td style={{backgroundColor: this.random_color()}}></td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderRow(row, i) {
        return (
            <ListItem key={i}>
                <div
                    className='left'
                    onClick={this.openCommentInfoPop.bind(this, i)}
                    id={i === this.state.commentInfoPopN ? "comment_info_pop_target" : ""}
                >
                    {row.user_name === "" ? this.renderUserArt(row.user_id) : ""}
                    <div className="user_name">
                        {row.user_name}
                    </div>
                </div>
                <div className='center'>
                    <div className='comment_text'>
                        {row.raw}
                    </div>
                </div>
            </ListItem>
        );
    }

    componentDidMount() {
        this.page = document.getElementById('mainFrame').querySelector('.page__content');
        this.page.addEventListener("scroll", function() {
            if (!this.isBottom || this.lastScrollHeight === this.page.scrollHeight) {
                this.isBottom = (this.page.scrollTop+this.page.offsetHeight === this.page.scrollHeight);
            } else {
                this.page.scrollTop = this.lastScrollHeight = this.page.scrollHeight;
            }
        }.bind(this));
    }

    componentDidUpdate() {
        if (this.isBottom) {
            this.page.scrollTop = this.lastScrollHeight = this.page.scrollHeight;
        }
    }

    render() {
        return (
            <div>
                <List
                    dataSource={this.props.data}
                    renderRow={this.renderRow.bind(this)}
                    renderHeader={() => <ListHeader>Comments</ListHeader>} />

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
