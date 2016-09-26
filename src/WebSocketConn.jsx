import { Component } from 'react';
import ons from 'onsenui';

export default class WebSocketConn extends Component {
    handleMessage(jsonm) {
        const m = JSON.parse(jsonm);
        switch (m.domain) {
        case 'nagome_comment':
            if (m.command === "Got") {
                this.props.onMessageChange(m.content);
            }
            break;
        default:
            console.log(m);
        }
    }

    send(jsonm) {
        this.wsconn.send(jsonm);
    }

    connect() {
        if (!("WebSocket" in window)) {
            ons.notification.alert("WebSocket NOT supported by your Browser!");
            return;
        }

        this.wsconn = new WebSocket("ws://localhost:8753/ws");

        this.wsconn.onerror = (err) => {
            ons.notification.alert("connection error");
            console.log(err);
        };

        this.wsconn.onopen = () => {
            console.log("open");
        };

        this.remainMes = "";
        this.wsconn.onmessage = function (m) {
            let ms = m.data.split("\n");
            ms[0] = this.remainMes + ms[0];
            this.remainMes = ms.pop();
            ms.forEach(this.handleMessage, this);
        }.bind(this);

        this.wsconn.onclose = () => {
            console.log("close");
        };

        window.addEventListener("beforeunload", function (event) {
            this.wsconn.close();
        });
    }

    componentDidMount() {
        this.connect();
    }

    render() {
        return null;
    }
};
