# Faking RPi Board /!\
from util import context_finder as context

from PIL import Image
import core.stepper_motor as st
import picamera
import subprocess


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
            self.camera.capture(path, name, "png")
            camera.close()
            img = Image.fromarray(bgr.array, 'P')
            img.save('{}/{}.png'.format(path, name))

if __name__ == "__main__":
    scanner = Scanner()
    camera = scanner.camera
    scanner.capture("/home/pi", "out")
    #core.sayHello()
