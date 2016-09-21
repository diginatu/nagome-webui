import { Component } from 'react';

class WebSocketConn extends Component {
    addMessage(m) {
        document.getElementById("output").textContent += m + "\n";
    }

    send(m) {
        this.wsconn.send(m);
    }

    connect() {
        if (!("WebSocket" in window)) {
            alert("WebSocket NOT supported by your Browser!");
            return;
        }

        this.wsconn = new WebSocket("ws://localhost:8753/ws");

        this.wsconn.onerror = (err) => {
            console.log(err);
        };

        this.wsconn.onopen = () => {
            document.getElementById("output").textContent += "conected\n";
        };

        this.remainMes = "";
        this.wsconn.onmessage = function (m) {
            let ms = m.data.split("\n");
            ms[0] = this.remainMes + ms[0];
            this.remainMes = ms.pop();
            for (let i = ms.length - 1; i >= 0; i--) {
                this.addMessage(ms[i]);
            }
        };

        this.wsconn.onclose = () => {
            document.getElementById("output").textContent += "closed\n";
        };

        window.addEventListener("beforeunload", function (event) {
            this.wsconn.close();
        });
    }

    componentDidMount() {
        setTimeout(this.connect, 3000);
    }

    render() {
        return null;
    }
}

export default WebSocketConn;
