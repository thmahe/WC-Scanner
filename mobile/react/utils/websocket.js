

let websocket;

export default class websocketUtil {

    constructor(props){
        this.remote_server_address = "ws://192.168.99.103:6789";
        this.props = props;

        websocket = new WebSocket(this.remote_server_address);
        let that= this;
        websocket.onmessage = function(event) {
            let data = JSON.parse(event.data);
            console.log(data);
            switch (data.type) {
                case 'projects_data':
                    that._stateListProject(data.data);
                    break;
                default:
                    console.error(
                        "unsupported event", data);
            }
        };
    }

    get_connection_status() {
        if (websocket.readyState === websocket.CLOSED) {
            this.updateConnectionStatus();
        }else{
            this.updateConnectionStatus();
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
            this._stateConnectionFalse()
        } else {
            this._stateConnectionTrue()
        }
    }

    create_project(project) {
        websocket.send(JSON.stringify({
            action: "create_project",
            project_name: project.project_name,
            description: project.project_description,
            pict_per_rotation: project.project_ppr,
            pict_res: project.project_picture_resolution,
        }))
    }


    _stateConnectionFalse() {
        const action = { type: "STATE_CHANGE", value: false };
        this.props.dispatch(action)
    }

    _stateConnectionTrue() {
        const action = { type: "STATE_CHANGE", value: true };
        this.props.dispatch(action)
    }

    _stateListProject(data){
        const action = { type: "STATE_RELOAD_LISTPROJECT", value: data};
        this.props.dispatch(action);
    }

}