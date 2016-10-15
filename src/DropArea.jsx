import React, { Component } from 'react';
import {Icon} from 'react-onsenui';

// Only display and not catch actual dropping.
export default class DropArea extends Component {
    constructor() {
        super();
        this.state = {dropping: false};

        // Stop to move in hole page.
        document.ondragover = document.ondrop = function(e) {
            e.preventDefault();
            return false;
        };
    }

    handleDropOver() {
        this.setState({dropping: true});
    }

    handleDropLeave() {
        this.setState({dropping: false});
    }


    render() {
        return (
            <div style={{
                border: `dashed ${this.state.dropping?7:5}px #BBB`,
                flex: "1 0 10px",
                borderRadius: "30px",
                margin: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "rgb(90, 90, 90)",
            }}
                onDragOver={this.handleDropOver.bind(this)}
                onDragLeave={this.handleDropLeave.bind(this)} >
                <Icon style={{fontSize: "50px"}} icon="ion-link" />
                <Icon style={{fontSize: "20px"}} icon="ion-chevron-down" />
                <p style={{fontSize: "20px"}}>Drop link here</p>
            </div>
            );
    }
}

