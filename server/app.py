#!/usr/bin/env python3

import asyncio
import json
import websockets
import subprocess

from util import logger
from core.scanner import Scanner
from util import project_manager as pm
from util import upload as upload

APP_PATH = '/home/pi/.wcscanner'
USERS = set()
scanner = Scanner()
logger = logger.logger


async def send_project_data_users():
    """
    Send complete list of projects data
    """
    if USERS:
        wrapped_pr_data = dict()
        wrapped_pr_data['type'] = 'projects_data'
        wrapped_pr_data['data'] = pm.get_projects_data()
        await asyncio.wait([user.send(json.dumps(wrapped_pr_data)) for user in USERS])


async def register(websocket):
    """
    Register a new client using his websocket
    :param websocket: websocket of the client
    """
    USERS.add(websocket)
    await send_project_data_users()


async def unregister(websocket):
    """
    Remove a websocket of the client list when the websocket connection is closed
    :param websocket: client to remove
    """
    USERS.remove(websocket)
    await send_project_data_users()


async def mainLoop(websocket, path):
    """
    Main loop that catch entry message given by users
    Send back a response, ex after a scan loop we send projects data
    :param websocket: websocket used for external communication (client)
    """
    await register(websocket)
    try:
        await send_project_data_users()

        async for message in websocket:
            data = json.loads(message)
            logger.info("Message received : %s", str(data))

            if data['action'] == 'loop_capture':
                scanner.loop_capture(data['project_name'])
                await send_project_data_users()

            elif data['action'] == 'create_project':
                pm.create_project(data['project_name'], data['description'], data['pict_per_rotation'], data['pict_res'])
                await send_project_data_users()

            elif data['action'] == 'turn_bed_CW':
                angle = float(data['plateau_degree'])
                scanner.turn_bed(angle)
                await send_project_data_users()

            elif data['action'] == 'turn_bed_CCW':
                angle = float(data['plateau_degree'])
                scanner.turn_bed(-1 * angle)
                await send_project_data_users()

            elif data['action'] == 'request_project_info':
                await websocket.send(pm.get_projects_data())

            elif data['action'] == 'request_upload_email_project':
                project_name = data['project_name']
                email_to = data['email_to']
                pm.zip_project(project_name)

                upload.send_email_zip_project(project_name, email_to)
                await send_project_data_users()

            elif data['action'] == 'request_remove_project':
                project_name = data['project_name']
                pm.remove_single_project(project_name)
                await send_project_data_users()

            elif data['action'] == 'camera_preview':
                data = scanner.get_preview_capture()
                msg = {'type': 'camera_preview', 'data': data}
                await websocket.send(json.dumps(msg))

            else:
                logger.error("unsupported event: {}", data)

    finally:
        await unregister(websocket)


def activeUSB(usbNumber):
    """
    Show active usb devices connected to the host running this script
    :param usbNumber:
    :return:
    """
    usb = subprocess.check_output('lsusb')
    usb = usb.decode()
    liste = []
    tmp = ""
    for i in range(0, len(usb) - 3):
        if usb[i] == '\n':
            liste.append(tmp)
            tmp = ""
        else:
            tmp = tmp + usb[i]

    res = []

    for i in liste:
        if i[4:7] == str(usbNumber):
            res.append(i)

    for i in res:
        i = i.split(" ")


if __name__ == '__main__':
    pm.create_base_projects_folder()
    pm.get_projects_data()
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(mainLoop, '0.0.0.0', 6789))
    asyncio.get_event_loop().run_forever()

