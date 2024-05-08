from machine import Pin
import time

# GPIO 33 – 内置红色指示灯
pin_33 = Pin(33, Pin.OUT)

# 该 LED 使用逻辑是反着的
# 一般情况下 pin_xx.value(1)是通电(亮) ，pin_xx.value(0)是不通电(不亮)
# 但这里比较特殊 pin_xx.value(0)是亮 ， pin_xx.value(1)是不亮

pin_33.value(0)
time.sleep(5)
pin_33.value(1)