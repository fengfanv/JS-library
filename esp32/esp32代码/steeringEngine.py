# 舵机控制（MG90S）
from machine import Pin,PWM
import time


def toDeg(deg):
    
    p4 = PWM(Pin(15))
    p4.freq(50) # 舵机定死的频率值(50Hz)，不可随意改变
    
    if deg == 180:
        p4.duty_u16(8192)
    elif deg == 90:
        p4.duty_u16(4915)
    elif deg == 0:
        p4.duty_u16(1638)
        
    time.sleep(0.1)
    p4.deinit() # 停止PWM并释放引脚。解决舵机转动到某个角度时，舵机会呲呲响的问题

'''
toDeg(180)
print('当前是180deg')
time.sleep(3)
toDeg(90)
print('当前是90deg')
time.sleep(3)
toDeg(0)
print('当前是0deg')
time.sleep(3)
toDeg(90) # 恢复成90deg
print('当前是90deg')
'''
    
    