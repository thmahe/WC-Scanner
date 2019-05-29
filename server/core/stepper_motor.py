
# Faking RPi Board /!\
from util import context_finder

import RPi.GPIO as GPIO
from time import sleep

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


if __name__ == "__main__":
    motor = StepperMotor(12,15,15,200,32)