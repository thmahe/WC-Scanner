# FAKE RPi
import sys
import fake_rpi
import png
from PIL import Image
sys.modules['RPi'] = fake_rpi.RPi
sys.modules['RPi.GPIO'] = fake_rpi.RPi.GPIO
sys.modules['smbus'] = fake_rpi.smbus
sys.modules['picamera'] = fake_rpi.picamera
sys.modules['serial'] = fake_rpi.serial

## END FAKING

from time import sleep
import RPi.GPIO as GPIO
import picamera
import pigpio
import math
import subprocess
from scipy.integrate import quad


class StepperMotor:

    ## DIR, STEP, ENABLE PINS
    def __init__(self, ENABLE_PIN, STEP_PIN, DIR_PIN, step_per_rotation, micro_step):
        GPIO.setmode(GPIO.BCM)

        self.DIR_PIN = DIR_PIN
        self.STEP_PIN = STEP_PIN
        self.ENABLE_PIN = ENABLE_PIN
        self.CW = GPIO.HIGH
        self.CCW = GPIO.LOW
        self.SPR = step_per_rotation * micro_step

        GPIO.setup(self.DIR_PIN, GPIO.OUT)
        GPIO.setup(self.STEP_PIN, GPIO.OUT)
        GPIO.setup(self.ENABLE_PIN, GPIO.OUT)
        GPIO.output(self.DIR_PIN, self.CW)

    def turn(self, degree):
        GPIO.setmode(GPIO.BCM)
        if degree < 0:
            GPIO.output(self.DIR_PIN, self.CW)
        else:
            GPIO.output(self.DIR_PIN, self.CCW)

        delay = 0.005 / 64
        step_count = int((self.SPR / 360) * abs(degree))
        GPIO.output(self.ENABLE_PIN, GPIO.LOW)
        for x in range(step_count):
            GPIO.output(self.STEP_PIN, GPIO.HIGH)
            sleep(delay)
            GPIO.output(self.STEP_PIN, GPIO.LOW)
            sleep(delay)
        GPIO.output(self.ENABLE_PIN, GPIO.LOW)


class Scanner:

    def __init__(self):
        self.bed_rotation = 0
        self.camera = picamera.PiCamera()
        self.bed_motor = StepperMotor(12, 6, 5, 200, 32)

    def sayHello(self):
        self.turn_bed(360)
        self.turn_bed(-360)

    def turn_bed(self, degrees):
        self.bed_motor.turn(degrees)

    def capture(self, path, name):
        im_shape = (2464, 3280)
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
    #scanner.sayHello()
