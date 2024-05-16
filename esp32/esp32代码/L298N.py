# L298N pwm调速demo
# 可以调速，但是L298N会发出类似蜂鸣器的响声

from machine import PWM, Pin
import utime

# 使用L298N进行pwm调速，需要先拔掉L298N上ENA、ENB的跳线帽

# 然后把ENA、ENB 分别连接到 开发板上的GPIO口

# (IN1,IN2)、(IN3,IN4)还和原来一样能控制电机正反转

# ENA、ENB 控制电机转速


# 如下，我使用ENB控制电机转速，使用(IN3,IN4)控制电机转动方向

IN3 = Pin(14, Pin.OUT)
IN4 = Pin(2, Pin.OUT)

# 正转
# IN3.value(1)
# IN4.value(0)

# 反转
IN3.value(0)
IN4.value(1)


# ENB引脚
ENB_PIN = 0 # GPIO0

# 创建一个PWM对象，频率为1000Hz（可以根据需要调整）
pwm = PWM(Pin(ENB_PIN), freq=1000, duty=0)

try:
    for duty in range(0, 1023):
        pwm.duty(duty)
        print(duty)
        utime.sleep_ms(50)
    
    pwm.deinit()
    IN3.value(0)
    IN4.value(0)

except KeyboardInterrupt:
    # 如果按下Ctrl+C，则停止PWM并退出循环
    pwm.deinit()
    IN3.value(0)
    IN4.value(0)
    print("PWM stopped")
