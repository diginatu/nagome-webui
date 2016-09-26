import React, { Component } from 'react';
//import ons from 'onsenui';
import {List, ListItem, ListHeader, Icon} from 'react-onsenui';

export default class CommentList extends Component {
    renderRow(row, i) {
        //<img src={`http://usericon.nimg.jp/usericon/1124/11246304.jpg?1391944188`} className='list__item__thumbnail' alt="?" />
        return (
            <ListItem key={i}>
                <div className='left'>
                    <Icon size={{default: 34, material: 42}} icon='ion-person' className='list__item__thumbnail' />
                </div>
                <div className='left'>
                    {row.user_id}
                </div>
                <div className='center'>
                    {row.comment}
                </div>
            </ListItem>
            );
    }

    render() {
        return (
            <List dataSource={this.props.data} renderRow={this.renderRow}
                renderHeader={() => <ListHeader>Comment List</ListHeader>} />
            );
    }
}
