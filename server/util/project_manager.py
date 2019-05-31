import os
import re
import subprocess
import json

from . import context_finder as context
from . import logger

log = logger.logger


def create_project(project_name, description="", picture_per_rotation=15, picture_res="1640x1232"):
    wcscanner_path = context.__BASE_PATH__ + '/.wcscanner'

    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        os.mkdir(wcscanner_path, mode=0o777)
        log.info("Base folder '.wcscanner' created in %s", context.__BASE_PATH__)
    else:
        log.info("Base folder '.wcscanner' already in %s", context.__BASE_PATH__)

    folders = os.listdir(wcscanner_path)
    folders_same_name_size = len(list(filter(re.compile(r'^' + project_name + '_\d+$')
                                             .search, folders)))
    project_data = dict()

    if folders_same_name_size > 0 or project_name in folders:
        log.info("Project %s already exist.", project_name)
        project_data['name'] = '{}_{}'.format(project_name, folders_same_name_size + 1)
    else:
        project_data['name'] = project_name

    os.mkdir(wcscanner_path + '/{}'.format(project_data['name']))
    log.info("Project %s created.", project_data['name'])

    project_data['description'] = description
    project_data['pict_per_rotation'] = picture_per_rotation
    project_data['pict_res'] = picture_res

    log.info("Saving project configuration")

    with open(wcscanner_path + '/{}/.project'.format(project_data['name']), 'w') as config_file:
        json.dump(project_data, config_file, indent=4)
        config_file.close()

def list_projects():
    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        return []
    return os.listdir(context.__BASE_PATH__+'/.wcscanner')


def get_projects_data():
    wcscanner_path = context.__BASE_PATH__ + '/.wcscanner'

    data = []
    for project in os.listdir(wcscanner_path):
        f = open('{}/{}/.project'.format(wcscanner_path, project), 'r')
        data.append(f.read())
        f.close()

    return data


def __remove_all_projects__():
    p = subprocess.Popen('rm -rf {}/.wcscanner/*'.format(context.__BASE_PATH__), shell=True)
    p.wait()


def __remove_base_directory__():
    p = subprocess.Popen('rm -rf {}/.wcscanner'.format(context.__BASE_PATH__), shell=True)
    p.wait()
