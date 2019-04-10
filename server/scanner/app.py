#!/usr/bin/env python3

# WS server example that synchronizes state across clients

import asyncio
import json
import logging
import os
import re
import websockets
import subprocess

logging.basicConfig()

APP_PATH = os.environ['HOME'] + '/.wcscanner'

STATE = {'value': 0}

USERS = set()


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
                print(data)
            elif data['action'] == 'turn_bed_CCW':
                print(data)
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


if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(counter, 'localhost', 6789))
    asyncio.get_event_loop().run_forever()
