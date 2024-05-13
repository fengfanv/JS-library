import machine

btn = machine.Pin(0, machine.Pin.IN)

def callback(pin):
    print('按下boot按钮了')

btn.irq(trigger=machine.Pin.IRQ_FALLING, handler=callback)
