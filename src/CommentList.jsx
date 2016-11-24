import React, { Component } from 'react';
//import ons from 'onsenui';
import {List, ListItem, ListHeader} from 'react-onsenui';

export default class CommentList extends Component {
    constructor() {
        super();
        this.isBottom = true;
    }
    static getThumbnail(row) {
        if (row.user_thumbnail_url!==undefined && row.user_thumbnail_url!=="") {
            return <img src={row.user_thumbnail_url} alt="user thumbnail" className='list__item__thumbnail' />;
        } else {
            return null;
        }
    }

    renderRow(row, i) {
        return (
            <ListItem key={i}>
                <div className='left'
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        width: "80px",
                        minWidth: "80px",
                        backgroundColor: row.is_anonymity?"":"rgba(24, 162, 0, 0.12),rgba(0, 0, 0, 0)"
                    }}>
                    {CommentList.getThumbnail(row)}
                    <div style={{ textAlign: "center", fontSize: "12px" }}>
                        {row.user_name}
                    </div>
                </div>
                <div className='center'>
                    <div>
                        {row.raw}
                    </div>
                </div>
                <div className='right'
                    style={{
                        width: "80px",
                        minWidth: "80px",
                    }}>
                    <div>
                        {row.date}
                    </div>
                </div>
            </ListItem>
            );
    }

    componentDidMount() {
        this.page = document.getElementById('mainPage').querySelector('.page__content');
        this.page.addEventListener("scroll", function() {
            if (!this.isBottom || this.lastScrollHeight === this.page.scrollHeight) {
                this.isBottom = (this.page.scrollTop+this.page.offsetHeight === this.page.scrollHeight);
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
            <List dataSource={this.props.data} renderRow={this.renderRow}
                renderHeader={() => <ListHeader>Comments</ListHeader>} />
            );
    }
}
