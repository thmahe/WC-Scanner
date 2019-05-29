from time import sleep
import RPi.GPIO as GPIO
from picamera import PiCamera

class StepperMotor :

    ## DIR, STEP, ENABLE PINS
    def __init__(self, DIR_PIN, STEP_PIN, ENABLE_PIN, step_per_rotation, micro_step):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
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
        if degree < 0 :
            GPIO.output(self.DIR_PIN, self.CW)
        else :
            GPIO.output(self.DIR_PIN, self.CCW)

        delay = 0.005 / 64
        step_count = int((self.SPR / 360) * abs(degree))
        GPIO.output(self.ENABLE_PIN, GPIO.LOW)
        for x in range(step_count):
            GPIO.output(self.STEP_PIN, GPIO.HIGH)
            sleep(delay)
            GPIO.output(self.STEP_PIN, GPIO.LOW)
            sleep(delay)
        GPIO.output(self.ENABLE_PIN, GPIO.HIGH)


class Scanner :

    def __init__(self):

        self.bed_rotation = 0
        self.cam_rotation = 0

        self.camera = PiCamera()

        self.bed_motor = StepperMotor(20, 21, 16, 200, 32)

        self.camera_motor = StepperMotor(26,13,19,200,32)


    def turn_bed(self, degrees):
        self.bed_motor.turn(degrees)

	def visual(self, onoff):
		if onoff == 1 :
			subprocess.Popen('motion', shell=True)
		else:
			subprocess.Popen('pkill motion', shell=True)

	def takePicture(self, nb):
		self.camera.capture('{nb}.jpg', format=jpeg, use_video_port=False)

	def closeCam(self):
		self.camera.close()
		


if __name__ == "__main__":

	scanner = Scanner()

	for i in range(3):
		scanner.turn_bed(180)
		sleep(0.5)

	GPIO.cleanup()
