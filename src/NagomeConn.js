import ons from 'onsenui';
export var ngm;


class WebSocketConn {
    constructor(wsEventHdlr) {
        this.wsEventHdlr = wsEventHdlr;
    }

    send(jsonm) {
        this.wsconn.send(jsonm);
    }

    sendObj(obj) {
        this.wsconn.send( JSON.stringify(obj) );
    }

    connect(messageHandler) {
        if (!("WebSocket" in window)) {
            ons.notification.alert("WebSocket is NOT supported by this browser");
            return;
        }

        if (process.env.NODE_ENV === "development") {
            this.wsconn = new WebSocket(`ws://localhost:8753/ws`);
        } else {
            // make absolute ws uri
            let loc = window.location, prot;
            if (loc.protocol === "https:") {
                prot = "wss:";
            } else {
                prot = "ws:";
            }
            this.wsconn = new WebSocket(`${prot}//${loc.host}/ws`);
        }

        this.wsconn.onerror = (err) => {
            console.log(err);
            this.wsEventHdlr("err");
        };

        this.wsconn.onopen = () => {
            this.wsEventHdlr("open");
        };

        this.remainMes = "";
        this.beforMes = [];
        this.wsconn.onmessage = function(m) {
            let ms = m.data.split("\n");
            ms[0] = this.remainMes + ms[0];
            this.remainMes = ms.pop();
            this.beforMes = this.beforMes.concat(ms);
            if (this.remainMes.length === 0) {
                messageHandler(this.beforMes);
                this.beforMes = [];
            }
        }.bind(this);

        this.wsconn.onclose = () => {
            this.wsEventHdlr("close");
        };
    }
}

class Ngmconn {
    constructor(websocketEventHandlerFn) {
        this.evHdlr = [];
        this.domainList = [];
        this.ws = new WebSocketConn(websocketEventHandlerFn);
    }

    handleMessage(jsonArrM) {
        let arrMD = [];
        let m;
        for (let i = 0, len = jsonArrM.length; i < len; i++) {
            try {
                m = JSON.parse(jsonArrM[i]);
            } catch (e) {
                console.log(e);
                console.log(jsonArrM[i]);
                continue;
            }
            let ind = this.domainList.indexOf(m.domain);
            if (ind === -1) {
                console.log(m);
                continue;
            }
            if (arrMD[ind] === undefined) {
                arrMD[ind] = [];
            }
            arrMD[ind].push(m);
        }
        for (let i = 0, len = arrMD.length; i < len; i++) {
            if (arrMD[i] !== undefined) {
                for (let j = 0, lenf = this.evHdlr[i].length; j < lenf; j++) {
                    this.evHdlr[i][j](arrMD[i]);
                }
            }
        }
    }

    connectWs() {
        this.ws.connect(this.handleMessage.bind(this));
    }

    addNgmEvHandler(domain, fn) {
        let ind = this.domainList.indexOf(domain);
        if (ind === -1) {
            ind = this.domainList.length;
            this.domainList.push(domain);
        }
        if (this.evHdlr[ind] === undefined) {
            this.evHdlr[ind] = [];
        }
        this.evHdlr[ind].push(fn);
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

    sendComment(s, iyayo = false) {
        this.ws.sendObj(
            {
                "domain": "nagome_query",
                "command": "Broad.SendComment",
                "content": {
                    "text": s,
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

    pluginList() {
        this.ws.sendObj(
            {
                "domain": "nagome_direct",
                "command": "Plug.List"
            }
        );
    }

    pluginEnable(no, enable) {
        this.ws.sendObj(
            {
                "domain": "nagome_query",
                "command": "Plug.Enable",
                "content": {
                    "no": no,
                    "enable": enable,
                }
            }
        );
    }

    settingsCurrent() {
        this.ws.sendObj(
            {
                "domain": "nagome_direct",
                "command": "Settings.Current"
            }
        );
    }

    settingsAll() {
        this.ws.sendObj(
            {
                "domain": "nagome_direct",
                "command": "Settings.All"
            }
        );
    }

    settingsSetCurrent(settings) {
        this.ws.sendObj(
            {
                "domain": "nagome_query",
                "command": "Settings.Set",
                "content": settings,
            }
        );
    }

}

// NagomeInit (function (string event), function(object nagomeMessage))
export var NagomeInit = (nagomeEventHandler, websocketEventHandler) => {
    ngm = new Ngmconn(nagomeEventHandler, websocketEventHandler);
};
