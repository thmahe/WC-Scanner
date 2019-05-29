from . import context_finder as context
from . import logger
import os
import re


log = logger.logger

def create_project(project_name):

    if context.running_on_raspberry:
        home_dir = os.environ['HOME']
    else:
        home_dir = '/home/pi'

    wcscanner_path = home_dir + '/.wcscanner'

    if '.wcscanner' not in os.listdir(home_dir):
        os.mkdir(wcscanner_path)
        log.info("Base folder '.wcscanner' created in %s", home_dir)
    else:
        log.info("Base folder '.wcscanner' already in %s", home_dir)

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
