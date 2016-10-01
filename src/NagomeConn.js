import ons from 'onsenui';
export var ngm;

// function (EVENTTYPE type, object content)
var eventHdlr;
var wsconn;

const EventType = {
    comment: 0
};

class WebSocketConn {
    send(jsonm) {
        wsconn.send(jsonm);
    }

    connect(messageHandler) {
        if (!("WebSocket" in window)) {
            ons.notification.alert("WebSocket NOT supported by your Browser!");
        }

        wsconn = new WebSocket("ws://localhost:8753/ws");

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
        const m = JSON.parse(jsonm);
        switch (m.domain) {
        case 'nagome_comment':
            if (m.command === "Got") {
                eventHdlr(EventType.comment, m.content);
            }
            break;
        default:
            console.log(m);
        }
    }

    connectWs() {
        this.ws.connect(this.handleMessage);
    }
}

var Init = (eventHandler) => {
    ngm = new Ngmconn(eventHandler);
};

var NagomeConn = {
    Init: Init,
    EventType: EventType
};

export default NagomeConn;
