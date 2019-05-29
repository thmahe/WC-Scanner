#!/usr/bin/env python3

# WS server example that synchronizes state across clients

import asyncio
import json
import logging
import os
import re
import websockets
from scanner.scanner import Scanner
import subprocess

logging.basicConfig()

APP_PATH = '/home/pi/.wcscanner'

STATE = {'value': 0}

USERS = set()

scanner = Scanner()

def state_event():
    return json.dumps({'type': 'state', **STATE})


def users_event():
    return json.dumps({'type': 'users', 'count': len(USERS)})


async def notify_state():
    print(USERS)
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = state_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def notify_users():
    print(USERS)
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = users_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
    USERS.add(websocket)
    await notify_users()


async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()


async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    try:
        await websocket.send(state_event())

        async for message in websocket:
            data = json.loads(message)
            if data['action'] == 'minus':
                STATE['value'] -= 1
                await notify_state()
            elif data['action'] == 'plus':
                STATE['value'] += 1
                await notify_state()
            elif data['action'] == 'create_project':
                print(data)
                await createProject(data['name_project'])
            elif data['action'] == 'turn_bed_CW':
                angle = int(data['plateau_degree'])
                scanner.turn_bed(angle)
                await notify_state()
            elif data['action'] == 'turn_bed_CCW':
                print(data)
                angle = int(data['plateau_degree'])
                scanner.turn_bed(-1 * angle)
                await notify_state()
            else:
                logging.error(
                    "unsupported event: {}", data)
    finally:
        await unregister(websocket)


def createProject(message):
    home_dir = os.environ['HOME']
    print(home_dir)
    folders = os.listdir(home_dir)
    wcscanner_path = home_dir + '/.wcscanner'
    if '.wcscanner' not in folders :
        os.mkdir(wcscanner_path)
    else :
        print(".wscanner already created")
    folders = os.listdir(wcscanner_path)
    print(folders)

    regex = re.compile(r'^'+ message +'_\d+$')
    folders_same_name_size = len(list(filter(regex.search, folders)))
    print(folders_same_name_size)
    if folders_same_name_size > 0 or message in folders:
        os.mkdir(wcscanner_path + '/{}_{}'.format(message, folders_same_name_size + 1))
    else :
        os.mkdir(wcscanner_path + '/{}'.format(message))


def takePhoto(projectName, degre):
    home_dir = os.environ['HOME']
    wcscanner_path = home_dir + '/.wcscanner'
    a=360/degre
    for id in range(0, a) :
        os.system('raspistill -vf -hf -o {}/{}/{}.jpg'.format(wcscanner_path, projectName, id))
        scanner.turn_bed(degre)
    return 1

def activeUSB():
    usb = a=subprocess.Popen('lsusb',stdout=subprocess.PIPE,shell=True)
    @TODO


if __name__ == '__main__':
    scanner.turn_bed(720)
    scanner.turn_bed(-720)
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(counter, '0.0.0.0', 6789))
    asyncio.get_event_loop().run_forever()

