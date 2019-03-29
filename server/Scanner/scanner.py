from time import sleep
import RPi.GPIO as GPIO
from picamera import PiCamera

class StepperMotor :

    ## DIR, STEP, ENABLE PINS
    def __init__(self, DIR_PIN, STEP_PIN, ENABLE_PIN, step_per_rotation, micro_step):
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

    def turn(self, degree):
        if degree < 0 :
            GPIO.output(self.DIR_PIN, self.CW)
        else :
            GPIO.output(self.DIR_PIN, self.CCW)

        delay = 0.005 / 64
        step_count = int((self.SPR / 360) * degree)
        GPIO.output(self.ENABLE_PIN, GPIO.LOW)
        for x in range(step_count):
            GPIO.output(self.STEP_PIN, GPIO.HIGH)
            sleep(delay)
            GPIO.output(self.STEP_PIN, GPIO.LOW)
            sleep(delay)
        GPIO.output(self.ENABLE_PIN, GPIO.LOW)
        GPIO.cleanup()




class Scanner :

    def __init__(self):


        self.bed_rotation = 0
        self.cam_rotation = 0

        self.camera = PiCamera()

        self.bed_motor = StepperMotor(20, 21, 12, 200, 32)


    def turn_bed(self, degrees):
        self.bed_motor.turn(degrees)


scanner = Scanner()

scanner.turn_bed(360)
scanner.turn_bed(-360)

