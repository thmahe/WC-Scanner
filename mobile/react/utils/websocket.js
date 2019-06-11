let websocket;
export default class websocketUtil {

    constructor(){
        this.remote_server_address = "ws://wcscanner.local:6789";
    }

    get_connection_status() {
        websocket = new WebSocket(this.remote_server_address);
        if (websocket.readyState === websocket.CLOSED) {
            websocket.onclose = () => this.updateConnectionStatus();
            websocket.onopen = () => this.updateConnectionStatus();
        }
    }

    turn_bed_CCW_trigger(angle) {
        websocket.send(JSON.stringify({
            action: "turn_bed_CCW",
            plateau_degree: angle
        }))
    }

    turn_bed_CW_trigger(angle) {
        websocket.send(JSON.stringify({
            action: "turn_bed_CW",
            plateau_degree: angle
        }))
    }

    updateConnectionStatus() {
        if (websocket.readyState === websocket.CLOSED) {

        } else {


        }
    }



}

