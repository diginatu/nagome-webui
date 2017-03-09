import React, { Component } from 'react';
//import ons from 'onsenui';
import {List, ListItem, ListHeader} from 'react-onsenui';

export default class CommentList extends Component {
    constructor() {
        super();
        this.isBottom = true;
        this.userArtSeed = 0;
    }

    djb2_hash(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            // '|0' converts into 32-bit int
            hash = (((hash << 5) + hash) + str.charCodeAt(i))|0;
        }
        this.userArtSeed = hash;
        return hash;
    }

    lcg_random(seed = this.userArtSeed) {
        const a = 22695477;
        const c = 1;
        let rand = (seed * a + c)|0;
        this.userArtSeed = rand;
        return rand; // '|0' converts into 32-bit int
    }

    random_color() {
        const r = this.lcg_random() >>> 2;
        let colnm = '#' + ('000000' + r.toString(16)).slice(-6);
        return colnm;
    }

    renderUserArt(comment) {
        if (comment.user_name === "") {
            this.djb2_hash(comment.user_id);
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
    }

    renderRow(row, i) {
        return (
            <ListItem key={i}>
                <div className='left'>
                    <div className="no">
                        {row.no}
                    </div>
                    {this.renderUserArt(row)}
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
            <List
                dataSource={this.props.data}
                renderRow={this.renderRow.bind(this)}
                renderHeader={() => <ListHeader>Comments</ListHeader>} />
        );
    }
}
