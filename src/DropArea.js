import React, { Component } from 'react';
import {Icon} from 'react-onsenui';
import ons from 'onsenui';

// Only display and not catch actual dropping.
export default class DropArea extends Component {
    constructor() {
        super();
        this.state = {dropping: false};

        // Stop to move in hole page.
        document.ondragover = this.stopMovePage;
        document.ondrop = this.stopMovePage;
    }

    stopMovePage(e) {
        e.preventDefault();
        return false;
    }

    handleDropOver() {
        this.setState({dropping: true});
        return false;
    }

    handleDropLeave() {
        this.setState({dropping: false});
    }


    render() {
        if (ons.platform.isIOS() || ons.platform.isAndroid() || ons.platform.isBlackBerry()) {
            return null;
        }
        return (
            <div
                style={{
                    border: `dashed ${this.state.dropping?6:4}px #BBB`,
                    flex: "1 0 10px",
                    borderRadius: "30px",
                    margin: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: this.state.dropping?"rgb(236, 236, 236)":"rgb(255, 255, 255)",
                    color: "rgb(90, 90, 90)",
                }}
                onDrop={this.stopMovePage}
                onDragOver={this.handleDropOver.bind(this)}
                onDragLeave={this.handleDropLeave.bind(this)} >
                <Icon size={50} icon="ion-link" />
                <Icon size={20} icon="ion-chevron-down" />
                <p style={{fontSize: "20px"}}>Drop link here</p>
            </div>
        );
    }
}

