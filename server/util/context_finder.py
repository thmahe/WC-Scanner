import sys
import os
import fake_rpi

'''
Find the context where the application is run
In the case where python can import package RPi.GPIO and picamera, the python script is running on a Raspberry Pi

In the other case, we use the package fake_rpi to simulate both GPIO and picamera
'''
running_on_raspberry = True

__BASE_PATH__ = os.environ['HOME']
__PROJECTS_PATH__ = __BASE_PATH__ + "/.wcscanner"
try :
    import RPi.GPIO
    import picamera

except RuntimeError as e:
    if str(e) == 'This module can only be run on a Raspberry Pi!':
        fake_rpi.toggle_print(False)
        sys.modules['RPi'] = fake_rpi.RPi
        sys.modules['RPi.GPIO'] = fake_rpi.RPi.GPIO
        sys.modules['smbus'] = fake_rpi.smbus
        sys.modules['picamera'] = fake_rpi.picamera
        sys.modules['serial'] = fake_rpi.serial
    else:
        raise RuntimeError(e)

    running_on_raspberry = False
    __BASE_PATH__ = '/home/pi'
    __PROJECTS_PATH__ = __BASE_PATH__ + "/.wcscanner"

