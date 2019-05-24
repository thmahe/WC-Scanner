from time import sleep
import RPi.GPIO as GPIO
#from picamera import PiCamera
import pigpio
import math
import subprocess
import numpy as np
import scipy

class StepperMotor :

	## DIR, STEP, ENABLE PINS
	def __init__(self,ENABLE_PIN, STEP_PIN, DIR_PIN, step_per_rotation, micro_step):
		self.GPIO = pigpio.pi()
		self.DIR_PIN = DIR_PIN
		self.STEP_PIN = STEP_PIN
		self.ENABLE_PIN = ENABLE_PIN
		self.CW = GPIO.HIGH
		self.CCW = GPIO.LOW
		self.SPR = step_per_rotation * micro_step

		self.GPIO.set_mode(self.DIR_PIN, pigpio.OUTPUT)
		self.GPIO.set_mode(self.STEP_PIN, pigpio.OUTPUT)
		self.GPIO.set_mode(self.ENABLE_PIN, pigpio.OUTPUT)
		#self.GPIO.set_PWM_frequency(self.STEP_PIN, 5000)

	def turn(self, degree):
		if degree < 0 :
			self.GPIO.write(self.DIR_PIN, self.CW)
		else :
			self.GPIO.write(self.DIR_PIN, self.CCW)

		delay = 0.005 / 64
		step_count = int((self.SPR / 360) * abs(degree))
		self.GPIO.write(self.ENABLE_PIN, 0)
		self.generate_ramp(self.generate_progressive_range(18, step_count, 0))

		while self.GPIO.wave_tx_busy():
			sleep(0.1)

		self.GPIO.write(self.ENABLE_PIN, 1)

	def generate_progressive_range(self,range_count, step_count, time_per_rotation):
		print(step_count)

		values = [math.sin(math.radians(i)) for i in range(1,361, 180 // range_count)]
		print(len(values))
		print(values)

		mean = 0
		std = 0.01

		x1 = mean + std
		x2 = mean + 2.0 * std

		def normal_distribution_function(x):
			value = scipy.stats.norm.pdf(x, mean, std)
			return value

		res, err = scipy.integrate.quad(normal_distribution_function, x1, x2)

		range_data = [[int(abs(values[i] * 5000)), int(abs(values[i]) * step_count)] for i in range(range_count)]

		for i in range(1,len(range_data)):
			range_data[i][1] -= range_data[i-1][1]

		print(range_data)

		sum2 = 0
		for e in range_data :
			sum2 += e[1]

		print(sum2)

		return range_data

	def generate_ramp(self, ramp):
		self.GPIO = pigpio.pi()
		self.GPIO.wave_clear()  # clear existing waves
		length = len(ramp)  # number of ramp levels
		wid = [-1] * length

		# Generate a wave per ramp level
		for i in range(length):
			frequency = ramp[i][0]
			micros = int(500000 / frequency)
			wf = []
			wf.append(pigpio.pulse(1 << self.STEP_PIN, 0, micros))  # pulse on
			wf.append(pigpio.pulse(0, 1 << self.STEP_PIN, micros))  # pulse off
			self.GPIO.wave_add_generic(wf)
			wid[i] = self.GPIO.wave_create()

		# Generate a chain of waves
		chain = []
		for i in range(length):
			steps = ramp[i][1]
			x = steps & 255
			y = steps >> 8
			chain += [255, 0, wid[i], 255, 1, x, y]

		self.GPIO.wave_chain(chain)  # Transmit chain.
		self.GPIO.stop()




class Scanner :

	def __init__(self):
		GPIO.setmode(GPIO.BCM)
		subprocess.call('sudo pigpiod', shell=True)
		sleep(1)
		self.bed_rotation = 0
		self.cam_rotation = 0

		#self.camera = PiCamera()

		self.bed_motor = StepperMotor(12, 6, 5, 200, 32)

		#self.camera_motor = StepperMotor(26,13,19,200,32)


	def turn_bed(self, degrees):
		self.bed_motor.turn(degrees)
		


if __name__ == "__main__":
	scanner = Scanner()

	scanner.turn_bed(360)
	scanner.turn_bed(-360)
	scanner.bed_motor.GPIO.stop()
	#GPIO.cleanup()
