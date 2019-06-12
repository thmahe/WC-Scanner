const path = require('path');
const $ = require("jquery");
const fs = require("fs");

var users, websocket;
var projects_data;

var camera_preview = fs.readFileSync(path.join(__dirname, 'assets/images/no_preview.b64')) + "";

var remote_server_address = "ws://wcscanner.local:6789";



var currentProjectDownloading = null;



function connectWebsocket() {

    websocket = new WebSocket(remote_server_address);


    websocket.onmessage = function(event) {
        data = JSON.parse(event.data);
        console.log(data);
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
                $('#loading').hide();
                break;
            case 'camera_preview':
                camera_preview = data.data;
                if (document.getElementById('menu_control').classList.contains('active')){
                    drawControlContent();
                }
                break;
            case 'download_ready':
                project_name = data.project_name;
                $("#" + project_name + '_loader').hide();
                var button_download = "<button type=\"button\" class=\"btn btn-secondary\">Download</button>"
                document.getElementById(project_name +'_download').innerHTML = button_download;
                $("#" + project_name + '_export_button').hide();
                break;
            default:
                console.error(
                    "unsupported event", data);
        }
    };

    websocket.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 5 seconds.', e.reason);
        drawHomeContent();
        $('#loading').show();
        setTimeout(function() {
            connectWebsocket();
        }, 5000);
    };

    websocket.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        websocket.close();
    };
}


$(document).ready(function() {
    /**
     * RPi address
     */
    draw_navbar();
    $('#content').load("./core/home.html");
    drawHomeContent();

    connectWebsocket()

});


function draw_navbar(){
    let navbar_path = path.join(__dirname, 'core/navbar.html');
    document.getElementById('navbar').innerHTML = fs.readFileSync(navbar_path);
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

    if ($('.modal.in').length) {
        $('body').removeClass('modal-open');
        document.getElementById('content').innerHTML = text;
    }else {
        document.getElementById('content').innerHTML = text;
    }




    document.getElementById('menu_home').classList.remove("active");
    document.getElementById('menu_project').classList.remove("active");
    document.getElementById('menu_control').classList.add("active");
}

function drawProjectContent() {
    if (!$('.modal.in').length) {
        document.getElementById('menu_home').classList.remove("active");
        document.getElementById('menu_project').classList.add("active");
        document.getElementById('menu_control').classList.remove("active");

        let projects_html = "";
        projects_data.forEach(function (element) {
            projects_html += generate_project_html_element(element);
        });


        let project_path = path.join(__dirname, 'core/project.html');
        var content = fs.readFileSync(project_path) + "";
        content = content.replace("{{PROJECT_PLACEHOLDER}}", projects_html);
        document.getElementById('content').innerHTML = content;
    }
    $("#search_input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#projects .col-md-4").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });


}

function generate_project_html_element(project_data) {
    let project_path = path.join(__dirname, 'core/project_element.html');
    var content = fs.readFileSync(project_path) + "";
    content = content.replace(/{{project_name}}/g, project_data["name"]);
    content = content.replace(/{{preview_data}}/g, project_data["preview_data"]);
    content = content.replace(/{{project_description}}/g, project_data["description"]);
    content = content.replace(/{{project_pict_per_rotation}}/g, project_data["pict_per_rotation"]);
    content = content.replace(/{{project_pict_res}}/g, project_data["pict_res"]);
    content = content.replace(/{{project_size}}/g, project_data["size"]);
    return content;
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

function request_remove_project(project_name){
    websocket.send(JSON.stringify(
        {action: "request_remove_project", project_name: project_name}
    ))
}

function request_export_project(project_name){
    var loader = "<div class=\"d-flex justify-content-center\">\n" +
        "<div class=\"spinner-border text-primary\" role=\"status\">\n" +
                   "<span class=\"sr-only\">Loading...</span>\n"+
                "</div>\n"+
        "</div>\n";
    document.getElementById(project_name +'_loader').innerHTML = loader;

    websocket.send(JSON.stringify(
        {action: "request_zip_data", project_name: project_name}
    ));

    currentProjectDownloading = project_name;

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

function upload_email_project(project_name){
    websocket.send(JSON.stringify({
        action: "request_upload_email_project",
        project_name: project_name,
        email_to: document.getElementById("emailTo").value,
    }));
}
