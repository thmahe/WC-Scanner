# Faking RPi Board /!\
from util import context_finder as context

from PIL import Image
import core.stepper_motor as st
import picamera
import subprocess
import json
import os


class Scanner:

    def __init__(self):
        self.bed_rotation = 0
        self.camera = picamera.PiCamera()
        self.bed_motor = st.StepperMotor(12, 6, 5, 200, 32)

    def sayHello(self):
        self.turn_bed(360)
        self.turn_bed(-360)

    def turn_bed(self, degrees):
        self.bed_motor.turn(degrees)

    def capture(self, path, name, width=3280, height=2464):

        if context.running_on_raspberry :
            p = subprocess.Popen('raspistill -w {} -h {} -o {}/{}.jpg'.format(width, height, path, name), shell=True)
            p.wait()

        else:
            im_shape = (height, width)
            bgr = picamera.array.PiRGBArray(self.camera, size=im_shape)
            # assert c.resolution == (100, 100)
            self.camera.capture(path, name, "jpg")
            self.camera.close()
            img = Image.fromarray(bgr.array, 'L')
            img.save('{}/{}.jpg'.format(path, name))

    def loop_capture(self, project_name):

        project_path = '{}/{}'.format(context.__PROJECTS_PATH__, project_name)

        project_conf_f = open('{}/.project'.format(project_path), 'r')

        project_conf = json.load(project_conf_f)
        project_conf_f.close()


        image_count = len(os.listdir(project_path)) - 1 # -1 for config file

        ppr = int(project_conf['pict_per_rotation'])

        pres = list(map(int, project_conf['pict_res'].split('x')))

        bed_step = 360 // ppr
        for i in range(0, 360, bed_step):
            self.capture(project_path, image_count, pres[0], pres[1])
            self.turn_bed(bed_step)
            image_count += 1




if __name__ == "__main__":
    scanner = Scanner()
    camera = scanner.camera
    #scanner.capture("/home/pi", "out")

    scanner.loop_capture("test")

    #core.sayHello()
