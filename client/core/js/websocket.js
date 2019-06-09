var users, websocket;
var projects_data;
var camera_preview = "data:image/jpg;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
var remote_server_address = "ws://127.0.0.1:6789";

var retry = 0;

const $ = require("jquery");
const fs = require("fs");

function get_connection_status() {
    if (websocket.readyState === websocket.CLOSED) {
        websocket = new WebSocket(remote_server_address);
        websocket.onclose = function() {
            updateConnectionStatus();
        };
        websocket.onopen = function() {
            updateConnectionStatus();
        };
        retry += 1;
    }
    if (retry > 10) {
        require('electron').remote.getCurrentWindow().close();
    }
}

$(document).ready(function() {
    draw_navbar();
    $('#content').load("./core/home.html");
    /**
     * RPi address
     */
    websocket = new WebSocket(remote_server_address);

    setInterval(get_connection_status, 1000);

    drawHomeContent();

    websocket.onclose = function() {
        drawHomeContent();
        $('#loading').show();
    };
    websocket.onopen = function() {
        drawHomeContent();
        request_camera_capture();
        $('#loading').hide();
    };

    websocket.onmessage = function(event) {
        data = JSON.parse(event.data);
        switch (data.type) {
            case 'users':
                //document.getElementById('users').innerText = data.count.toString() + " user" + (data.count > 1 ? "s" : "");
                break;
            case 'state':
                //@TODO capter les changements dans les variables du scanner
                break;
            case 'projects_data':
                projects_data = data.data;
                if (document.getElementById('menu_project').classList.contains('active')){
                    drawProjectContent();
                }
                break;
            case 'camera_preview':
                camera_preview = data.data;
                if (document.getElementById('menu_control').classList.contains('active')){
                    drawControlContent();
                }
                break;
            default:
                console.error(
                    "unsupported event", data);
        }
    };
});

const path = require('path');

function draw_navbar(){
    let navbar_path = path.join(__dirname, 'core/navbar.html');
    document.getElementById('navbar').innerHTML = fs.readFileSync(navbar_path);
}

function updateConnectionStatus() {
    if (websocket.readyState === websocket.CLOSED) {
        document.getElementById('onlineContent').innerHTML = '<style>\n' +
            '    span[type=onlineIcon] {\n' +
            '        color: red; \n' +
            '     }\n';
    } else {

        var text = fs.readFileSync("./core/home.html");
        document.getElementById('onlineContent').innerHTML = '<style>\n' +
            '    span[type=onlineIcon] {\n' +
            '        color: white; \n' +
            '     }\n';
    }
}

function drawHomeContent() {

    let home_path = path.join(__dirname, 'core/home.html');
    let text = fs.readFileSync(home_path);
    document.getElementById('content').innerHTML = text;

    document.getElementById('menu_home').classList.add("active");
    document.getElementById('menu_project').classList.remove("active");
    document.getElementById('menu_control').classList.remove("active");
}

function drawControlContent() {

    let control_path = path.join(__dirname, 'core/control.html');
    var text = fs.readFileSync(control_path) + "";

    text = text.replace("{{PREVIEW_DATA}}", camera_preview);
    text = text.replace("{{PREVIEW_DATA}}", camera_preview);
    document.getElementById('content').innerHTML = text;

    document.getElementById('menu_home').classList.remove("active");
    document.getElementById('menu_project').classList.remove("active");
    document.getElementById('menu_control').classList.add("active");
}

function drawProjectContent() {

    document.getElementById('menu_home').classList.remove("active");
    document.getElementById('menu_project').classList.add("active");
    document.getElementById('menu_control').classList.remove("active");

    let projects_html = "";
    projects_data.forEach(function(element) {
        projects_html += generate_project_html_element(element);
    });



    let project_path = path.join(__dirname, 'core/project.html');
    var content = fs.readFileSync(project_path) + "";
    content = content.replace("{{PROJECT_PLACEHOLDER}}", projects_html);
    document.getElementById('content').innerHTML = content;

    $("#search_input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#projects .col-md-4").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

}

function generate_project_html_element(project_data) {
    return "<div class=\"col-md-4\" id='"+project_data["name"]+"'>\n" +
        "            <div class=\"card mb-4 box-shadow\">\n" +
        "                <img class=\"card-img-top\" src=\"data:image/jpg;base64, " + project_data["preview_data"] + "\" data-holder-rendered=\"true\">\n" +
        "                <div class=\"card-img-overlay\" style=\"display: flex; width: 100%; flex-direction: row; justify-content: flex-end; align-items: flex-start;\">\n" +
        "                    <button class=\"btn btn-secondary\" type=\"button\" onclick='download_zipfile_handler(\"" + project_data["name"] + "\")'>\n" +
        "                       <span class=\"oi oi-cloud-download m\" style=\"color: white; font-size:25px;\"/>\n" +
        "                     </button>\n" +
        "                </div>\n" +
        "                <div class=\"card-body\">\n" +
        "                    <h5 className=\"card-title\">"+ project_data["name"] + "</h5>\n" +
        "                    <p class=\"card-text\">"+ project_data["description"] + "</p>\n" +
        "                    <p class=\"card-text\">Pictures per revolution : "+ project_data["pict_per_rotation"] + "</p>\n" +
        "                    <p class=\"card-text\">Pictures resolution : "+ project_data["pict_res"] + "</p>\n" +
        "                    <div class=\"d-flex justify-content-between align-items-center\">\n" +
        "                        <div class=\"btn-group\">\n" +
        "                            <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\" onclick='start_loop_capture(\""+ project_data["name"] +"\")'>Start loop capture</button>\n" +
        "                            <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\">Edit</button>\n" +
        "                        </div>\n" +
        "                        <small class=\"text-muted\">"+ project_data['size'] +" Mb</small>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>"
}

/**
 * Turn bed clockwise
 */
function turn_bed_CW_trigger() {
    let angle = document.getElementById("turn_bed_value").value;
    websocket.send(JSON.stringify({
        action: "turn_bed_CW",
        plateau_degree: angle.toString()
    }))
}

function turn_bed_CCW_trigger() {
    let angle = document.getElementById("turn_bed_value").value;
    websocket.send(JSON.stringify({
        action: "turn_bed_CCW",
        plateau_degree: angle.toString()
    }))
}

function request_camera_capture(){
    websocket.send(JSON.stringify({
        action: "camera_preview"
    }))
}

function start_loop_capture(project_name){
    websocket.send(JSON.stringify({
        action: "loop_capture",
        project_name: project_name
    }))
}

/**
 * create project
 */

function create_project() {
    let project_name = document.getElementById("project_name").value;
    websocket.send(JSON.stringify({
        action: "create_project",
        project_name: project_name,
        description: document.getElementById('project_description').value,
        pict_per_rotation:document.getElementById('ppr_placeholder').innerText,
        pict_res:document.getElementById('pres_placeholder').innerText
    }))
}

function update_ppr_placeholder() {
    document.getElementById("ppr_placeholder").innerHTML = document.getElementById("project_ppr").value;
    updateEstimatedSize();
}

function update_pres_placeholder(value) {
    let new_placeholder;
    switch (value + "") {
        case "1" :
            new_placeholder = "640x480";
            break;
        case "2" :
            new_placeholder = "1640x1232";
            break;
        case "3" :
            new_placeholder = "3280x2464";
            break;
        default :
            new_placeholder = "None"
    }

    document.getElementById("pres_placeholder").innerHTML = new_placeholder;
    updateEstimatedSize()
}

function updateEstimatedSize(){

    let new_placeholder = "Estimated size : ";

    let picture_res = document.getElementById("project_pres").value;
    let total_pictures = 3 * document.getElementById("project_ppr").value;

    let picture_size;
    // in KB
    switch (picture_res + "") {
        case "1" :
            picture_size = 62;
            break;
        case "2" :
            picture_size = 413;
            break;
        case "3" :
            picture_size = 1650;
            break;
        default :
            picture_size = 0
    }

    total_size = (picture_size * total_pictures) / 1000;

    document.getElementById("estimated_size_placeholder").innerHTML = new_placeholder + total_size.toFixed(2) + "Mb / complete rotation";
}

function download_zipfile_handler(project_name){
    websocket.send(JSON.stringify({
        action: "download-data",
        project_name: project_name
    }))
}