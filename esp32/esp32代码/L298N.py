# L298N调速demo
# 可以调速，但是L298N会发出类似蜂鸣器的响声

from machine import PWM, Pin
import utime

# 假设ENA引脚连接到开发板的某个GPIO引脚，这里以GPIO18为例
ENA_PIN = 18

# 创建一个PWM对象，频率为1000Hz（可以根据需要调整）
pwm = PWM(Pin(ENA_PIN), freq=1000, duty=0)

try:
    # 设定速度变化步长和速度变化的总时间
    step = 10
    max_duty = 1023  # 假设占空比范围是0-1023
    change_time = 5  # 速度变化总时间，单位为秒

    # 正向增加速度
    for duty in range(0, max_duty + 1, int(max_duty / (change_time * 100))):
        pwm.duty(duty)
        utime.sleep_ms(100)  # 稍微等待一下以便平滑变化

    # 等待一段时间以便观察高速旋转
    utime.sleep(2)

    # 反向减少速度
    for duty in range(max_duty, -1, -int(max_duty / (change_time * 100))):
        pwm.duty(duty)
        utime.sleep_ms(100)  # 稍微等待一下以便平滑变化

    # 可以重复以上过程或者添加其他逻辑

except KeyboardInterrupt:
    # 如果按下Ctrl+C，则停止PWM并退出循环
    pwm.deinit()
    print("PWM stopped")
