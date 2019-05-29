from time import sleep
import RPi.GPIO as GPIO
#from picamera import PiCamera
import pigpio
import math
import subprocess
from scipy.integrate import quad

class StepperMotor:

    ## DIR, STEP, ENABLE PINS
    def __init__(self, ENABLE_PIN, STEP_PIN, DIR_PIN, step_per_rotation, micro_step):
        self.GPIO = pigpio.pi()
        if not self.GPIO.connected:
            p = subprocess.Popen('sudo pigpiod', shell=True)
            p.wait()
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

    # self.GPIO.set_PWM_frequency(self.STEP_PIN, 5000)

    def turn(self, degree):
        self.GPIO = pigpio.pi()
        if degree < 0:
            self.GPIO.write(self.DIR_PIN, self.CW)
        else:
            self.GPIO.write(self.DIR_PIN, self.CCW)

        step_count = int((self.SPR / 360) * abs(degree))
        self.GPIO.write(self.ENABLE_PIN, 0)
        self.generate_ramp(self.generate_progressive_range(20, step_count))

        while self.GPIO.wave_tx_busy():
            sleep(0.5)

        self.GPIO.write(self.ENABLE_PIN, 1)
        self.GPIO.stop()

    def generate_progressive_range(self, range_count, step_count):

        max_speed = math.log(math.pow(step_count, 7), 2) * 25

        sin_reduction = [abs(math.sin(math.radians(i))) for i in range(1, 181, 180 // range_count)]

        frequencies = [int(max_speed * sin_reduction[i]) for i in range(range_count)]

        ranges = [i for i in range(1, 181, 180 // range_count)]


        def result(a,b):
            return quad(lambda x: max_speed * abs(math.sin(math.radians(x))), a, b)

        total_step_ratio = result(0, 180)[0]

        steps = [int(step_count * (result(ranges[i-1], ranges[i])[0] / total_step_ratio)) for i in range(1, len(ranges))]

        steps.insert(0, 5)
        missing_steps = step_count - sum(steps)

        if missing_steps > 0 :
            index_max_freq = frequencies.index(max(frequencies))
            steps[index_max_freq-1] += missing_steps

        range_data = [[frequencies[i], steps[i]] for i in range(range_count)]
     
        return range_data

    def generate_ramp(self, ramp):
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


class Scanner:

    def __init__(self):
        GPIO.setmode(GPIO.BCM)
        self.bed_rotation = 0
        # self.camera = PiCamera()
        self.bed_motor = StepperMotor(12, 6, 5, 200, 32)

    def sayHello(self):
        self.turn_bed(360)
        self.turn_bed(-360)

    def turn_bed(self, degrees):
        self.bed_motor.turn(degrees)


if __name__ == "__main__":
    scanner = Scanner()

    scanner.sayHello()

    scanner.bed_motor.GPIO.stop()
