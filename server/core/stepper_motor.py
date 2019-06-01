
# Faking RPi Board /!\
from util import context_finder

import RPi.GPIO as GPIO
from time import sleep


class StepperMotor:
    """
    Stepper motor class, configuration of the interface between the motor and the driver
    """

    def __init__(self, ENABLE_PIN, STEP_PIN, DIR_PIN, step_per_rotation, micro_step):
        """
        Configuration of the stepper motor driver
        :param ENABLE_PIN: pin to enable the stepper motor (break)
        :param STEP_PIN: pin to say to the stepper motor to make a step
        :param DIR_PIN: pin to say to the stepper in which direction he as to make the step
        :param step_per_rotation: the number of step required to make a complete rotation (Stepper motor property ex NEMA17 -> 200)
        :param micro_step: the number of micro step admit by the driver (in our case using DRV885 -> 32 micro steps)
        """
        GPIO.setmode(GPIO.BCM)

        self.DIR_PIN = DIR_PIN
        self.STEP_PIN = STEP_PIN
        self.ENABLE_PIN = ENABLE_PIN
        self.CW = GPIO.HIGH
        self.CCW = GPIO.LOW
        self.SPR = step_per_rotation * micro_step

        # Setting up GPIO pins
        GPIO.setup(self.DIR_PIN, GPIO.OUT)
        GPIO.setup(self.STEP_PIN, GPIO.OUT)
        GPIO.setup(self.ENABLE_PIN, GPIO.OUT)
        GPIO.output(self.DIR_PIN, self.CW)

    def turn(self, degree):
        """
        Turn the motor of x degrees
        this method compute the number of step to perform to apply the rotation
        :param degree: rotation in degrees to apply
        :return: None
        """

        # Sending the direction signal
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