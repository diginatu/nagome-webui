import React, { Component } from 'react';
//import ons from 'onsenui';
import {List, ListItem, ListHeader} from 'react-onsenui';

export default class CommentList extends Component {
    static getThumbnail(row) {
        let source;
        if (row.user_thumbnail_url!==undefined && row.user_thumbnail_url!=="") {
            source = row.user_thumbnail_url;
        } else {
            return null;
        }
        return <img src={source} alt="user thumbnail" className='list__item__thumbnail' />;
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

    render() {
        return (
            <List dataSource={this.props.data} renderRow={this.renderRow}
                renderHeader={() => <ListHeader>Comments</ListHeader>} />
            );
    }
}
