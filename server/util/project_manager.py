import os
import re
import subprocess
import json
from PIL import Image, ImageDraw, ImageFont
import base64
from io import BytesIO

from . import context_finder as context
from . import logger


log = logger.logger


def create_base_projects_folder():
    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        os.mkdir(context.__PROJECTS_PATH__, mode=0o777)
        log.info("Base folder '.wcscanner' created in %s", context.__BASE_PATH__)
    else:
        log.info("Base folder '.wcscanner' already in %s", context.__BASE_PATH__)


def create_project(project_name, description="", picture_per_rotation=15, picture_res="1640x1232"):
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
    if '.wcscanner' not in os.listdir(context.__BASE_PATH__):
        return []
    return os.listdir(context.__PROJECTS_PATH__)


def update_project_data(project_name):
    project_path = context.__PROJECTS_PATH__+ '/' + project_name
    f = open(project_path+'/.project', 'r')
    project_data = json.load(f)
    f.close()

    image_count = len(os.listdir(project_path)) - 1

    if image_count > 0 :

        img = Image.open('{}/{}.jpg'.format(project_path, image_count-1))
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode('ascii')

        project_data['preview_data'] = img_str
        project_data['size'] = round(int(subprocess.check_output(['du', project_path, '-k']).split()[0]) / 1000,2)

        with open('{}/.project'.format(project_path), 'w') as config_file:
            json.dump(project_data, config_file, indent=4)
            config_file.close()


def get_projects_data():
    wcscanner_path = context.__BASE_PATH__ + '/.wcscanner'

    data = []
    for project in os.listdir(wcscanner_path):
        update_project_data(project)
        project_path = '{}/{}'.format(wcscanner_path, project)
        f = open('{}/.project'.format(project_path), 'r')
        data.append(f.read())
        f.close()

    return data


def __remove_all_projects__():
    p = subprocess.Popen('rm -rf {}/.wcscanner/*'.format(context.__BASE_PATH__), shell=True)
    p.wait()


def __remove_base_directory__():
    p = subprocess.Popen('rm -rf {}/.wcscanner'.format(context.__BASE_PATH__), shell=True)
    p.wait()
