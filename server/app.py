#!/usr/bin/env python3

# WS server example that synchronizes state across clients
import asyncio
import json
import websockets
import subprocess

from util import logger
from core.scanner import Scanner
from util import project_manager as pm

APP_PATH = '/home/pi/.wcscanner'

STATE = {'value': 0}

USERS = set()

scanner = Scanner()

logger = logger.logger

def state_event():
    return json.dumps({'type': 'state', **STATE})


def users_event():
    return json.dumps({'type': 'users', 'count': len(USERS)})


async def notify_state():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = state_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def notify_users():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = users_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
    USERS.add(websocket)
    await notify_users()


async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()


async def mainLoop(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    try:
        await websocket.send(state_event())

        async for message in websocket:
            data = json.loads(message)
            logger.info("Message received : %s", str(data))
            if data['action'] == 'minus':
                STATE['value'] -= 1
                await notify_state()
            elif data['action'] == 'plus':
                STATE['value'] += 1
                await notify_state()
            elif data['action'] == 'create_project':
                pm.create_project(data['project_name'])
                await notify_state()
            elif data['action'] == 'turn_bed_CW':
                angle = float(data['plateau_degree'])
                scanner.turn_bed(angle)
                await notify_state()
            elif data['action'] == 'turn_bed_CCW':
                angle = float(data['plateau_degree'])
                scanner.turn_bed(-1 * angle)
                await notify_state()
            else:
                logger.error("unsupported event: {}", data)
    finally:
        await unregister(websocket)


def activeUSB(usbNumber):
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
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(mainLoop, 'localhost', 6789))
    asyncio.get_event_loop().run_forever()

