# 舵机控制（MG90S）
from machine import Pin,PWM
import time

def toDeg(deg):
    
    p4 = PWM(Pin(15))
    p4.freq(50) # 为啥这里设置频率值(50Hz)? 厂商规定舵机的一个pwm周期时长20ms(毫秒)。20ms转Hz是 { 1/(20/1000)=50 } 1是1秒，20/1000是将毫秒转成秒
    
    if deg == 0:
        dutyCycle = int((0.5/20)*65535) # 在一个时长为20ms的pwm周期内，高电平持续时长为0.5ms时，舵机转动到0度。将高电平的持续时长(ms,毫秒)转成这里的占空比(比例值)
        p4.duty_u16(dutyCycle)
    elif deg == 45:
        dutyCycle = int((1/20)*65535) # 在一个时长为20ms的pwm周期内，高电平持续时长为1ms时，舵机转动到45度。将高电平的持续时长(ms,毫秒)转成这里的占空比(比例值)
        p4.duty_u16(dutyCycle)
    elif deg == 90:
        dutyCycle = int((1.5/20)*65535) # 在一个时长为20ms的pwm周期内，高电平持续时长为1.5ms时，舵机转动到90度。将高电平的持续时长(ms,毫秒)转成这里的占空比(比例值)
        p4.duty_u16(dutyCycle)
    elif deg == 135:
        dutyCycle = int((2/20)*65535) # 在一个时长为20ms的pwm周期内，高电平持续时长为2ms时，舵机转动到135度。将高电平的持续时长(ms,毫秒)转成这里的占空比(比例值)
        p4.duty_u16(dutyCycle)
    elif deg == 180:
        dutyCycle = int((2.5/20)*65535) # 在一个时长为20ms的pwm周期内，高电平持续时长为2.5ms时，舵机转动到180度。将高电平的持续时长(ms,毫秒)转成这里的占空比(比例值)
        p4.duty_u16(dutyCycle)
        
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
    
    
