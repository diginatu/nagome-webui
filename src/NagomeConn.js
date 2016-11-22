import ons from 'onsenui';
export var ngm;

// function (object nagomeMessage)
var messageHdlr;
// function (string event)
var wsEventHdlr;
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
            ons.notification.alert("WebSocket is NOT supported by this browser");
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
            wsEventHdlr("err");
        };

        wsconn.onopen = () => {
            wsEventHdlr("open");
        };

        this.remainMes = "";
        wsconn.onmessage = function(m) {
            let ms = m.data.split("\n");
            ms[0] = this.remainMes + ms[0];
            this.remainMes = ms.pop();
            messageHandler(ms);
        }.bind(this);

        wsconn.onclose = () => {
            wsEventHdlr("close");
        };
    }
}

class Ngmconn {
    constructor(nagomeEventHandler, websocketEventHandler) {
        this.ws = new WebSocketConn();
        messageHdlr = nagomeEventHandler;
        wsEventHdlr = websocketEventHandler;
    }

    handleMessage(jsonArrM) {
        let arrM = [];
        let m;
        for (let i = 0, len = jsonArrM.length; i < len; i++) {
            try {
                m = JSON.parse(jsonArrM[i]);
            } catch (e) {
                console.log(e);
                console.log(jsonArrM[i]);
            }
            arrM.push(m);
        }
        messageHdlr(arrM);
    }

    connectWs() {
        this.ws.connect(this.handleMessage);
    }

    broadConnect(uri) {
        if (uri !== "" && uri !== null) {
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
    }

    broadDisconnect() {
        this.ws.sendObj(
            {
                "domain": "nagome_query",
                "command": "Broad.Disconnect"
            }
        );
    }

    sendComment(t, iyayo = false) {
        this.ws.sendObj(
            {
                "domain": "nagome_query",
                "command": "Broad.SendComment",
                "content": {
                    "text": t,
                    "iyayo": iyayo
                }
            }
        );
    }

    clearComments() {
        this.ws.sendObj(
            {
                "domain": "nagome_ui",
                "command": "ClearComments"
            }
        );

    }
}

export var NagomeInit = (nagomeEventHandler, websocketEventHandler) => {
    ngm = new Ngmconn(nagomeEventHandler, websocketEventHandler);
};
