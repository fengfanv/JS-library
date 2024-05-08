from machine import Pin
import time

pin_4 = Pin(4, Pin.OUT)

pin_4.value(1)
time.sleep(5)
pin_4.value(0)
