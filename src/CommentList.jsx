import React, { Component } from 'react';
//import ons from 'onsenui';
import {List, ListItem, ListHeader} from 'react-onsenui';

export default class CommentList extends Component {
    constructor() {
        super();
        this.isBottom = true;
    }

    renderRow(row, i) {
        return (
            <ListItem key={i}>
                <div className='left'>
                    <div className="no">
                        {row.no}
                    </div>
                    <div className="user_name">
                        {row.user_name}
                    </div>
                </div>
                <div className='center'>
                    <div>
                        {row.raw}
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
            <List dataSource={this.props.data} renderRow={this.renderRow}
                renderHeader={() => <ListHeader>Comments</ListHeader>} />
            );
    }
}
