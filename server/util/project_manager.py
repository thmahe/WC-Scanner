import os
import re
import subprocess

from . import context_finder as context
from . import logger

log = logger.logger


def create_project(project_name):
    wcscanner_path = context.__BASE_PATH__  + '/.wcscanner'

    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        os.mkdir(wcscanner_path, mode=0o777)
        log.info("Base folder '.wcscanner' created in %s", context.__BASE_PATH__)
    else:
        log.info("Base folder '.wcscanner' already in %s", context.__BASE_PATH__)

    folders = os.listdir(wcscanner_path)
    folders_same_name_size = len(list(filter(re.compile(r'^' + project_name + '_\d+$')
                                             .search, folders)))

    if folders_same_name_size > 0 or project_name in folders:
        log.info("Project %s already exist.", project_name)
        os.mkdir(wcscanner_path + '/{}_{}'.format(project_name, folders_same_name_size + 1))
        log.info("Project %s_%d created.", project_name, folders_same_name_size + 1)
    else:
        os.mkdir(wcscanner_path + '/{}'.format(project_name))
        log.info("Project %s created.", project_name)


def list_projects():
    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        return []
    return os.listdir(context.__BASE_PATH__+'/.wcscanner')


def __remove_all_projects__():
    p = subprocess.Popen('rm -rf {}/.wcscanner/*'.format(context.__BASE_PATH__), shell=True)
    p.wait()


def __remove_base_directory__():
    p = subprocess.Popen('rm -rf {}/.wcscanner'.format(context.__BASE_PATH__), shell=True)
    p.wait()
