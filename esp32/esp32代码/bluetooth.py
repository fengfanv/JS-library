from machine import Pin
from machine import Timer
import time
import bluetooth

BLE_MSG = ''

class ESP32_BLE():
    def __init__(self, name):
        self.name = name
        self.led = Pin(2, Pin.OUT) # esp32开发板的蓝led灯
        self.timer1 = Timer(0) # 定义一个定时器（esp32上有4个硬件定时器，编号为0,1,2,3）所以这里的意思是，使用编号0的定时器
        self.ble = bluetooth.BLE() # 创建蓝牙实例对象
        self.ble.active(True) # 启动蓝牙
        self.ble.config(gap_name=name) # 为蓝牙初始化名字
        self.disconnected()
        self.ble.irq(self.ble_irq) # 蓝牙事件回调，绑定回调函数
        self.register() # esp32定义自己的服务功能是什么
        self.ble.gatts_write(self.rx, bytes(100)) # 突破蓝牙接收消息时20个字节限制。设置接收消息缓冲区长度。这句话必须等到self.register执行完，才能执行。
        self.advertiser() # esp32广播自己

    def connected(self):
        # 蓝牙与手机连接成功后，让蓝led灯，长亮
        self.led.value(1)
        self.timer1.deinit()

    def disconnected(self):
        # 蓝牙未连接手机时，让蓝led灯，闪烁
        def callback(timer):
            self.led.value(not self.led.value())
                
        # period=100 单位，ms，毫秒
        # mode=Timer.ONE_SHOT 定时器运行一次。100ms后执行callback。类似js的setTimeout
        # mode=Timer.PERIODIC 定时器定期运行。每隔100ms就执行一次callback。类似js的setInterval
        self.timer1.init(period=100, mode=Timer.PERIODIC, callback=callback)

    def ble_irq(self, event, data):
        # 蓝牙事件回调函数
        global BLE_MSG
        if event == 1: # _IRQ_CENTRAL_CONNECT 手机与此蓝牙连接成功
            self.connected()
        elif event == 2: # _IRQ_CENTRAL_DISCONNECT 手机与此蓝牙断开连接
            self.advertiser()
            self.disconnected()
        elif event == 3: # _IRQ_GATTS_WRITE 监听到手机向此蓝牙发送数据
            buffer = self.ble.gatts_read(self.rx)
            BLE_MSG = buffer.decode('UTF-8')
            
    def register(self):
        # 注册(或定义)esp32蓝牙具备的服务(或功能)（可以设置多个功能）
        service_uuid = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'
        reader_uuid = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'
        sender_uuid = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'

        services = (
            # 给esp32蓝牙定义一个服务
            (
                bluetooth.UUID(service_uuid), # 给这个服务绑定一个id
                (
                    (bluetooth.UUID(sender_uuid), bluetooth.FLAG_NOTIFY), # 这个服务，具有（通知），具有 esp32给手机发送通知 的能力（esp32 to 手机）
                    (bluetooth.UUID(reader_uuid), bluetooth.FLAG_WRITE), # 这个服务，具有（写），具有 手机可以给esp32发消息 的能力（手机 to esp32）
                )
            ),
            # 给esp32蓝牙定义第二个服务
            # ...
        )

        ((self.tx, self.rx,), ) = self.ble.gatts_register_services(services)
        # self.tx 用来发送数据
        # self.rx 用来接收数据

    def send(self, data):
        # esp32向手机发消息
        self.ble.gatts_notify(0, self.tx, data)
        
    def advertiser(self):
        # esp32蓝牙未连接手机时，esp32蓝牙广播自己，让手机看到自己，然后连接自己
        
        name = self.name.encode('utf-8') # 将 蓝牙名 从utf-8编码转成bytes数据
        

        AD_Structure_1 = bytearray(b'\x02\x01\x06')
        AD_Structure_2 = bytearray(1 + len(name)) + bytearray(b'\x09') + name
        
        adv_data = AD_Structure_1 + AD_Structure_2
        
        # 蓝牙广播数据包结构： AdvA + (AdvData(或ScanRspData))  两部分
        #                    6字节 +      最多31字节
        # AdvA(蓝牙设备的MAC地址)
        # AdvData(广播的数据包内容)
        
        # AdvData由若干个广播数据单元(AD Structure)组成
        # AD Structure的结构是：Length + Type + data
        
        # 分析上面AD_Structure_1 ：
        # 字段名    长度(字节)   取值(16进制)     说明
        # Length    1           0x02            表示当前AD_Structure_1里(Type+Data)的长度是多少。这里parseInt('0x02',16)=2
        # Type      1           0x01            表示该广播数据单元(AD_Structure_1)代表的含义是什么。类似key:value里的key。0x01表示 设备标识
        # Data      1           0x06            表示该广播数据单元(AD_Structure_1)代表的含义的值是什么。类似key:value里的value。0x06表示LE通用可发现模式。LE(低功耗蓝牙)，BR/EDR(经典蓝牙)。esp32只支持LE，不支持BR/EDR。默认一般将蓝牙广播设为普通发现模式，所以我们只设置Bit1和Bit2，即0x06（b00000110）
        
        # bit0：LE受限可发现模式。
        # bit1：LE通用可发现模式。
        # bit2：不支持BR/EDR。
        # bit3：对Same Device Capable（控制器）同时支持BLE和BR/EDR。
        # bit4：对Same Device Capable（主机）同时支持BLE和BR/EDR。
        # bit5~7：预留。
        
        # 分析上面AD_Structure_2 ：
        # 字段名    长度(字节)     取值(16进制)     说明
        # Length    1             1+len(name)     表示当前AD_Structure_2里(Type+Data)的长度是多少。
        # Type      1             0x09            表示该广播数据单元(AD_Structure_2)代表的含义是什么。类似key:value里的key。0x09表示 蓝牙名称
        # Data      len(name)     name            表示该广播数据单元(AD_Structure_2)代表的含义的值是什么。这里值是 初始化时自定义的蓝牙名
        
        # 参考连接：https://blog.csdn.net/he_wen_jie/article/details/133620929

        self.ble.gap_advertise(100, adv_data) # 每隔100us广播一次

def buttons_handler(pin):
    led.value(not led.value())


def get_led_status():
    if led.value() == 1:
        return 'led is on'
    else:
        return 'led is off'


if __name__ == "__main__":
    ble = ESP32_BLE("wangge")

    but = Pin(0, Pin.IN)
    but.irq(trigger=Pin.IRQ_FALLING, handler=buttons_handler)

    led = Pin(2, Pin.OUT)

    while True:
        if BLE_MSG == 'get_led':
            
            print(BLE_MSG)
            BLE_MSG = ''
            
            value = get_led_status()
            print('手机查询led状态：',value)
            ble.send(value)
            
        time.sleep_ms(100)
