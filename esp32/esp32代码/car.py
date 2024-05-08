import machine
import time

# 左电机
p32 = machine.Pin(18,machine.Pin.OUT)
p33 = machine.Pin(19,machine.Pin.OUT)

# # 左电机(前进)
# p32.value(0)
# p33.value(1)

# # 左电机(后退)
# p32.value(1)
# p33.value(0)

# 右电机
p12 = machine.Pin(22,machine.Pin.OUT)
p13 = machine.Pin(23,machine.Pin.OUT)

# # 右电机(前进)
# p12.value(1)
# p13.value(0)

# # 右电机(后退)
# p12.value(0)
# p13.value(1)



def car_up():
    # 左前进
    p32.value(0)
    p33.value(1)
    # 右前进
    p12.value(1)
    p13.value(0)
    time.sleep(0.3) # 延迟0.3秒(300毫秒)
    p32.value(0)
    p33.value(0)
    p12.value(0)
    p13.value(0)

def car_down():
    # 左后退
    p32.value(1)
    p33.value(0)
    # 右后退
    p12.value(0)
    p13.value(1)
    time.sleep(0.3) # 延迟0.3秒(300毫秒)
    p32.value(0)
    p33.value(0)
    p12.value(0)
    p13.value(0)

def car_left():
    # 左后退
    p32.value(1)
    p33.value(0)
    # 右前进
    p12.value(1)
    p13.value(0)
    time.sleep(0.3) # 延迟0.3秒(300毫秒)
    p32.value(0)
    p33.value(0)
    p12.value(0)
    p13.value(0)

def car_right():
    # 左前进
    p32.value(0)
    p33.value(1)
    # 右后退
    p12.value(0)
    p13.value(1)
    time.sleep(0.3) # 延迟0.3秒(300毫秒)
    p32.value(0)
    p33.value(0)
    p12.value(0)
    p13.value(0)


