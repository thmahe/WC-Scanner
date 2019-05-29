import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)
GPIO.setup(21, GPIO.OUT)

for i in range(1 ,5):
    GPIO.output(21, 1)
    sleep(1)
    GPIO.output(21, 0)
    sleep(1)

GPIO.cleanup()