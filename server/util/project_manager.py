import os
import re
import subprocess
import json
from PIL import Image, ImageDraw
import base64
from io import BytesIO

from . import context_finder as context
from .logger import logger as log

"""
project_manager module, contain function to manage projects, create/modify configuration files
"""


def create_base_projects_folder():
    """
    Create the base project folder named `.wcscanner`
    This folder will contain projects folders
    """
    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        os.mkdir(context.__PROJECTS_PATH__, mode=0o777)
        log.info("Base folder '.wcscanner' created in %s", context.__BASE_PATH__)
    else:
        log.info("Base folder '.wcscanner' already in %s", context.__BASE_PATH__)


def create_project(project_name, description="", picture_per_rotation=15, picture_res="1640x1232"):
    """
    Function used to create projects folder and the projects configuration files
    In the case where the name `test` exist, project `test_1` will be created
    :param project_name: name of the project
    :param description: description of the project (optional)
    :param picture_per_rotation: the number of picture per complete rotation
    :param picture_res: pictures resolution
    """
    create_base_projects_folder()
    folders = os.listdir(context.__PROJECTS_PATH__)
    folders_same_name_size = len(list(filter(re.compile(r'^' + project_name + '_\d+$')
                                             .search, folders)))
    project_data = dict()

    if folders_same_name_size > 0 or project_name in folders:
        log.info("Project %s already exist.", project_name)
        project_data['name'] = '{}_{}'.format(project_name, folders_same_name_size + 1)
    else:
        project_data['name'] = project_name

    os.mkdir(context.__PROJECTS_PATH__ + '/{}'.format(project_data['name']))
    log.info("Project %s created.", project_data['name'])

    img = Image.new('RGB', (350, 225), color=(73, 109, 137))

    d = ImageDraw.Draw(img)
    d.text((100, 100), "No preview", fill=(255, 255, 0))

    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode('ascii')

    project_data['preview_data'] = img_str
    project_data['description'] = description
    project_data['pict_per_rotation'] = picture_per_rotation
    project_data['pict_res'] = picture_res
    project_data['size'] = round(int(subprocess.check_output(['du', context.__PROJECTS_PATH__ + '/{}'.format(project_data['name']), '-k']).split()[0]) / 1000, 2)

    log.info("Saving project configuration")

    with open(context.__PROJECTS_PATH__ + '/{}/.project'.format(project_data['name']), 'w') as config_file:
        json.dump(project_data, config_file, indent=4)
        config_file.close()


def list_projects():
    """
    Retrieve the list of created projects
    :return: list of projects names ex -> ['foo', 'bar']
    """
    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        return []
    return os.listdir(context.__PROJECTS_PATH__)


def update_project_data(project_name):
    """
    Update the project configuration file when needed
    Updated data :  - project size
                    - project preview image
    :param project_name: project that need an update
    """
    project_path = context.__PROJECTS_PATH__+ '/' + project_name
    f = open(project_path+'/.project', 'r')
    project_data = json.load(f)
    f.close()

    image_count = len(os.listdir(project_path)) - 2

    if image_count > 0:

        img = Image.open('{}/{}.jpg'.format(project_path, image_count-1))
        img = img.resize((640,480))
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode('ascii')

        project_data['preview_data'] = img_str
        project_data['size'] = round(int(subprocess.check_output(['du', project_path, '-k']).split()[0]) / 1000,2)

        with open('{}/.project'.format(project_path), 'w') as config_file:
            json.dump(project_data, config_file, indent=4)
            config_file.close()


def get_projects_data():
    """
    Seek and merge configuration files of all created projects
    :return: list of configuration files converted to json strings
    """
    wcscanner_path = context.__BASE_PATH__ + '/.wcscanner'

    data = []
    for project in os.listdir(wcscanner_path):
        if (os.path.isdir(os.path.join(wcscanner_path, project))):
            update_project_data(project)
            project_path = '{}/{}'.format(wcscanner_path, project)
            f = open('{}/.project'.format(project_path), 'r')
            data.append(json.load(f))
            f.close()
    return data

def remove_single_project(project_name):
    """
    Function to remove a project entirely
    :param project_name: name of the project to remove
    """
    p = subprocess.Popen('rm -rf {}/{}'.format(context.__PROJECTS_PATH__, project_name), shell=True)
    p.wait()

def __remove_all_projects__():
    """
    Dev function used to remove all projects
    """
    p = subprocess.Popen('rm -rf {}/.wcscanner/*'.format(context.__BASE_PATH__), shell=True)
    p.wait()


def __remove_base_directory__():
    """
    Dev method used to remove the base directory of the application
    """
    p = subprocess.Popen('rm -rf {}/.wcscanner'.format(context.__BASE_PATH__), shell=True)
    p.wait()

def zip_project(project_name):
    wcscanner_path = context.__BASE_PATH__ + '/.wcscanner'
    if os.listdir(wcscanner_path).__contains__(project_name):
        p1 = subprocess.Popen('cd {} && zip {}/{}.zip ./{}/*'.format( context.__PROJECTS_PATH__, context.__EXPORT_FOLDER__, project_name, project_name), shell=True)
        p1.wait()
    else:
        print('no folder {} found'.format(project_name))
