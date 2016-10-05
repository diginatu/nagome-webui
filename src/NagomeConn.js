import ons from 'onsenui';
export var ngm;

// function (EVENTTYPE type, object content)
var eventHdlr;
var wsconn;

class WebSocketConn {
    send(jsonm) {
        wsconn.send(jsonm);
    }

    sendObj(obj) {
        wsconn.send( JSON.stringify(obj) );
    }

    connect(messageHandler) {
        if (!("WebSocket" in window)) {
            ons.notification.alert("WebSocket NOT supported by your Browser!");
        }

        if (process.env.NODE_ENV === "development") {
            wsconn = new WebSocket(`ws://localhost:8753/ws`);
        } else {
            // make absolute ws uri
            let loc = window.location, prot;
            if (loc.protocol === "https:") {
                prot = "wss:";
            } else {
                prot = "ws:";
            }
            wsconn = new WebSocket(`${prot}//${loc.host}/ws`);
        }

        wsconn.onerror = (err) => {
            console.log(err);
            ons.notification.alert("connection error");
        };

        wsconn.onopen = () => {
            console.log("open");
        };

        this.remainMes = "";
        wsconn.onmessage = function (m) {
            let ms = m.data.split("\n");
            ms[0] = this.remainMes + ms[0];
            this.remainMes = ms.pop();
            ms.forEach(messageHandler, this);
        }.bind(this);

        wsconn.onclose = () => {
            console.log("close");
        };
    }
}

class Ngmconn {
    constructor(eventHandler) {
        this.ws = new WebSocketConn();
        eventHdlr = eventHandler;
    }

    handleMessage(jsonm) {
        eventHdlr(JSON.parse(jsonm));
    }

    connectWs() {
        this.ws.connect(this.handleMessage);
    }

    broadConnect(uri) {
        this.ws.sendObj(
            {
                "domain": "nagome_query",
                "command": "Broad.Connect",
                "content": {
                    "broad_id": uri
                }
            }
        );
    }

    broadDisconnect() {
        this.ws.sendObj(
            {
                "domain": "nagome_query",
                "command": "Broad.Disconnect"
            }
        );
    }
}

export var NagomeInit = (eventHandler) => {
    ngm = new Ngmconn(eventHandler);
};
