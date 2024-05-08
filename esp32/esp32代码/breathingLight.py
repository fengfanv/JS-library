from machine import Pin,PWM
import time

# 呼吸灯案例

# led2 = PWM(Pin(2))
# led2.freq(1000) # 设置频率1000。意思是1秒钟内执行多个PWM周期。一个PWM周期包含(高电平和低电平)两部分。高电平意思是高电压，低电平意思是低电压(单位,伏)。占空比意思是在一个PWM周期内高电平持续时间与周期总时间的比值，假设占空比最大值是1023，我设置占空比400，400/1023*100=39%，所以在一个PWM周期内高电平的时长为总周期的39%。

# led2.duty(10) # 设置 占空比。假如占空比最大值是1023，然后我这里设置1023，这时马达速度最快，假设我又设置占空比为512，则这时马达中速运转，又假设我设置占空比为0，则这时马达不转。


def startLed():
    led2 = PWM(Pin(2))
    led2.freq(1000)
    
    isLoop = True
    count = 0

    while isLoop:
        for i in range(0,1024,1): # range(0,1024,1) range(start,end,step) 生成的数组包含start，不包含end。
            led2.duty(i)
            time.sleep_ms(2) # 延时2毫秒
            
        for i in range(1023,-1,-1):
            led2.duty(i)
            time.sleep_ms(2) # 延时2毫秒
    
        count = count + 1
    
        if count == 10:
            isLoop = False
            led2.deinit()
            print('关闭呼吸灯')
            break


# startLed()